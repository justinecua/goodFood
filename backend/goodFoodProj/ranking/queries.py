from django.db import connections

# The "top" lists rank across the whole of goodFood - a diner should see the
# best-rated dishes and restaurants on the app, not only the handful that
# happen to be down the road. Distance is still returned when the diner has
# shared their location, so the cards can show how far away something is, but
# it only narrows the list when a caller explicitly asks for a radius.
# getNearbyRestaurants is the exception: "nearby" is the whole point of it.
DEFAULT_RADIUS_KM = 40
DEFAULT_LIMIT = 10

# Bayesian prior: a dish with two 5-star reviews shouldn't outrank one with
# forty 4.8s, so every score is pulled toward the global average until it has
# at least this many reviews behind it.
MIN_REVIEWS = 3

# Latitude/longitude are stored as free text (older rows look like
# "~8.229° N"), so every read strips anything that isn't part of a number
# before casting. A row that still doesn't parse is left out rather than
# blowing up the query.
COORD = "NULLIF(regexp_replace({column}, '[^0-9.-]', '', 'g'), '')::double precision"

# Great-circle distance in kilometres between the diner and a stored point.
# Clamped before acos() because floating point can push the cosine just past 1.
DISTANCE_KM = f"""
    6371 * acos(
        LEAST(1.0, GREATEST(-1.0,
            cos(radians(%s)) * cos(radians({COORD.format(column='l.latitude')}))
            * cos(radians({COORD.format(column='l.longitude')}) - radians(%s))
            + sin(radians(%s)) * sin(radians({COORD.format(column='l.latitude')}))
        ))
    )
"""


def _coords(data):
    """The diner's position, or (None, None) when they haven't shared it."""
    latitude = data.get("latitude")
    longitude = data.get("longitude")

    if latitude in (None, "") or longitude in (None, ""):
        return None, None

    try:
        return float(latitude), float(longitude)
    except (TypeError, ValueError):
        return None, None


def _number(value, fallback):
    try:
        return float(value)
    except (TypeError, ValueError):
        return fallback


def _radius(data, latitude, default=None):
    """The radius to clip results to, or None to rank across all of goodFood.

    A radius is only meaningful once we know where the diner is, so it is
    ignored when no coordinates came through.
    """
    if latitude is None:
        return None

    value = data.get("radius_km")

    if value in (None, ""):
        return default

    return _number(value, default)


def getTopRestaurants(data):
    try:
        connection = connections['default']
        cursor = connection.cursor()

        latitude, longitude = _coords(data)
        radius_km = _radius(data, latitude)
        limit = int(_number(data.get("limit"), DEFAULT_LIMIT))

        # Distance is only computable once the diner has shared a position;
        # without it the cards simply don't show one. Either way the ranking
        # covers every restaurant on goodFood.
        distance_select = DISTANCE_KM if latitude is not None else "NULL::double precision"
        distance_params = (
            [latitude, longitude, latitude] if latitude is not None else []
        )

        # No radius means no clipping - the ranking stays app-wide.
        radius_filter = "WHERE distance_km <= %s" if radius_km else ""
        radius_params = [radius_km] if radius_km else []

        cursor.execute(
            f"""
            WITH scored AS (
                SELECT r.restaurant_id,
                       r.restaurant_name,
                       r.restaurant_description,
                       r.address,
                       r.restaurant_logo_img,
                       r.restaurant_cover_img,
                       l.city,
                       l.province,
                       COUNT(rev.res_review_id) AS review_count,
                       AVG(rev.overall_rating) AS average_rating,
                       AVG(rev.food_rating) AS food_rating,
                       AVG(rev.service_rating) AS service_rating,
                       AVG(rev.ambiance_rating) AS ambiance_rating,
                       ({distance_select}) AS distance_km
                FROM restaurant_restaurant r
                LEFT JOIN location_location l
                    ON l.location_id = r.location_id
                LEFT JOIN review_restaurant_review rev
                    ON rev.restaurant_id = r.restaurant_id
                   AND rev.is_flagged = FALSE
                GROUP BY r.restaurant_id, l.city, l.province, l.latitude, l.longitude
            ),
            ranked AS (
                SELECT * FROM scored
                {radius_filter}
            )
            SELECT n.*,
                   (
                       (n.review_count::numeric / (n.review_count + %s))
                       * COALESCE(n.average_rating, 0)
                       + (%s::numeric / (n.review_count + %s))
                       * COALESCE((SELECT AVG(average_rating) FROM ranked), 0)
                   ) AS score,
                   (
                       SELECT c.category_name
                       FROM restaurant_category c
                       JOIN restaurant_restaurant_category rc
                           ON rc.category_id = c.category_id
                       WHERE rc.restaurant_id = n.restaurant_id
                       ORDER BY c.category_name
                       LIMIT 1
                   ) AS category_name
            FROM ranked n
            WHERE n.review_count > 0
            ORDER BY score DESC, n.distance_km ASC NULLS LAST, n.review_count DESC
            LIMIT %s;
            """,
            distance_params + radius_params + [MIN_REVIEWS, MIN_REVIEWS, MIN_REVIEWS, limit],
        )

        columns = [col[0] for col in cursor.description]
        restaurants = [dict(zip(columns, row)) for row in cursor.fetchall()]

        return {
            "restaurants": restaurants,
            "located": latitude is not None,
            "radius_km": radius_km,
        }

    except Exception as error:
        print(f"Error: {error}")
        return {"error": str(error)}

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def getTopDishes(data):
    try:
        connection = connections['default']
        cursor = connection.cursor()

        latitude, longitude = _coords(data)
        radius_km = _radius(data, latitude)
        limit = int(_number(data.get("limit"), DEFAULT_LIMIT))

        distance_select = DISTANCE_KM if latitude is not None else "NULL::double precision"
        distance_params = (
            [latitude, longitude, latitude] if latitude is not None else []
        )

        # No radius means no clipping - the ranking stays app-wide.
        radius_filter = "WHERE distance_km <= %s" if radius_km else ""
        radius_params = [radius_km] if radius_km else []

        cursor.execute(
            f"""
            WITH scored AS (
                SELECT d.dish_id,
                       d.dish_name,
                       d.dish_description,
                       d.dish_price,
                       d.is_signature,
                       d.is_best_seller,
                       r.restaurant_id,
                       r.restaurant_name,
                       c.dish_category_name,
                       l.city,
                       l.province,
                       COUNT(rev.dish_review_id) AS review_count,
                       AVG(rev.rating) AS average_rating,
                       (
                           SELECT di.dish_image_path
                           FROM dish_dish_images di
                           WHERE di.dish_id = d.dish_id
                           ORDER BY di.is_primary DESC, di.dish_image_id
                           LIMIT 1
                       ) AS dish_image_path,
                       ({distance_select}) AS distance_km
                FROM dish_dish d
                JOIN restaurant_restaurant r
                    ON r.restaurant_id = d.restaurant_id
                LEFT JOIN dish_dish_category c
                    ON c.dish_category_id = d.dish_category_id
                LEFT JOIN location_location l
                    ON l.location_id = r.location_id
                LEFT JOIN review_dish_review rev
                    ON rev.dish_id = d.dish_id
                WHERE d.is_available = TRUE
                GROUP BY d.dish_id, r.restaurant_id, c.dish_category_name,
                         l.city, l.province, l.latitude, l.longitude
            ),
            ranked AS (
                SELECT * FROM scored
                {radius_filter}
            )
            SELECT n.*,
                   (
                       (n.review_count::numeric / (n.review_count + %s))
                       * COALESCE(n.average_rating, 0)
                       + (%s::numeric / (n.review_count + %s))
                       * COALESCE((SELECT AVG(average_rating) FROM ranked), 0)
                   ) AS score
            FROM ranked n
            WHERE n.review_count > 0
            ORDER BY score DESC, n.distance_km ASC NULLS LAST, n.review_count DESC
            LIMIT %s;
            """,
            distance_params + radius_params + [MIN_REVIEWS, MIN_REVIEWS, MIN_REVIEWS, limit],
        )

        columns = [col[0] for col in cursor.description]
        dishes = [dict(zip(columns, row)) for row in cursor.fetchall()]

        return {
            "dishes": dishes,
            "located": latitude is not None,
            "radius_km": radius_km,
        }

    except Exception as error:
        print(f"Error: {error}")
        return {"error": str(error)}

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def getNearbyRestaurants(data):
    """Everything within the radius, nearest first - the map / browse list.

    Unlike getTopRestaurants this keeps restaurants that nobody has reviewed
    yet, so a new place still shows up for the diners around it.
    """
    try:
        connection = connections['default']
        cursor = connection.cursor()

        latitude, longitude = _coords(data)
        radius_km = _number(data.get("radius_km"), DEFAULT_RADIUS_KM)
        limit = int(_number(data.get("limit"), 50))

        distance_select = DISTANCE_KM if latitude is not None else "NULL::double precision"
        distance_params = (
            [latitude, longitude, latitude] if latitude is not None else []
        )
        radius_params = [radius_km] if latitude is not None else [float("inf")]

        cursor.execute(
            f"""
            WITH located AS (
                SELECT r.restaurant_id,
                       r.restaurant_name,
                       r.restaurant_description,
                       r.address,
                       r.restaurant_logo_img,
                       r.restaurant_cover_img,
                       l.city,
                       l.province,
                       COUNT(rev.res_review_id) AS review_count,
                       AVG(rev.overall_rating) AS average_rating,
                       ({distance_select}) AS distance_km
                FROM restaurant_restaurant r
                LEFT JOIN location_location l
                    ON l.location_id = r.location_id
                LEFT JOIN review_restaurant_review rev
                    ON rev.restaurant_id = r.restaurant_id
                   AND rev.is_flagged = FALSE
                GROUP BY r.restaurant_id, l.city, l.province, l.latitude, l.longitude
            )
            SELECT * FROM located
            WHERE distance_km IS NULL OR distance_km <= %s
            ORDER BY distance_km ASC NULLS LAST, review_count DESC
            LIMIT %s;
            """,
            distance_params + radius_params + [limit],
        )

        columns = [col[0] for col in cursor.description]
        restaurants = [dict(zip(columns, row)) for row in cursor.fetchall()]

        return {"restaurants": restaurants, "located": latitude is not None}

    except Exception as error:
        print(f"Error: {error}")
        return {"error": str(error)}

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def getRecentReviews(data):
    """The newest reviews left anywhere on goodFood, for the home screens.

    Restaurant and dish reviews come back in one list tagged by `review_kind`,
    the same shape getOwnerReviews uses, so the home screen can render both
    with the review card. Only reviews that actually say something are
    included - a feed of bare star ratings gives the reader nothing.
    """
    try:
        connection = connections['default']
        cursor = connection.cursor()

        latitude, longitude = _coords(data)
        radius_km = _radius(data, latitude)
        limit = int(_number(data.get("limit"), 5))

        distance_select = DISTANCE_KM if latitude is not None else "NULL::double precision"
        distance_params = (
            [latitude, longitude, latitude] if latitude is not None else []
        )
        radius_filter = "WHERE distance_km <= %s" if radius_km else ""
        radius_params = [radius_km] if radius_km else []

        cursor.execute(
            f"""
            WITH feed AS (
                SELECT 'restaurant' AS review_kind,
                       r.res_review_id AS review_id,
                       r.overall_rating AS rating,
                       r.comment,
                       r.created_at,
                       r.restaurant_id,
                       r.account_id,
                       NULL::integer AS dish_id,
                       NULL::varchar AS dish_name
                FROM review_restaurant_review r
                WHERE r.is_flagged = FALSE
                  AND r.comment IS NOT NULL
                  AND r.comment <> ''

                UNION ALL

                SELECT 'dish' AS review_kind,
                       r.dish_review_id AS review_id,
                       r.rating,
                       r.comment,
                       r.created_at,
                       r.restaurant_id,
                       r.account_id,
                       d.dish_id,
                       d.dish_name
                FROM review_dish_review r
                JOIN dish_dish d
                    ON d.dish_id = r.dish_id
                WHERE r.comment IS NOT NULL
                  AND r.comment <> ''
            ),
            located AS (
                SELECT f.*,
                       res.restaurant_name,
                       res.restaurant_logo_img,
                       l.city,
                       a.username,
                       a.first_name,
                       a.last_name,
                       a.account_profile_photo,
                       ({distance_select}) AS distance_km
                FROM feed f
                JOIN restaurant_restaurant res
                    ON res.restaurant_id = f.restaurant_id
                LEFT JOIN location_location l
                    ON l.location_id = res.location_id
                JOIN account_account a
                    ON a.account_id = f.account_id
            )
            SELECT * FROM located
            {radius_filter}
            ORDER BY created_at DESC
            LIMIT %s;
            """,
            distance_params + radius_params + [limit],
        )

        columns = [col[0] for col in cursor.description]
        reviews = [dict(zip(columns, row)) for row in cursor.fetchall()]

        return {"reviews": reviews, "located": latitude is not None}

    except Exception as error:
        print(f"Error: {error}")
        return {"error": str(error)}

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()
