from django.db import connections, IntegrityError


def getRestaurantReviews(data):
    try:
        connection = connections['default']
        cursor = connection.cursor()

        restaurant_id = data.get("restaurant_id")
        account_id = data.get("account_id")

        if not restaurant_id:
            return {"error": "restaurant_id is required"}

        cursor.execute(
            """
            SELECT r.*,
                   a.username,
                   a.first_name,
                   a.last_name,
                   a.account_profile_photo
            FROM review_restaurant_review r
            JOIN account_account a
                ON a.account_id = r.account_id
            WHERE r.restaurant_id = %s
              AND r.is_flagged = FALSE
            ORDER BY r.created_at DESC;
            """,
            [restaurant_id],
        )

        columns = [col[0] for col in cursor.description]
        reviews = [dict(zip(columns, row)) for row in cursor.fetchall()]

        # Averages plus the 5..1 star histogram, so the screen can draw the
        # bars without a second round trip.
        cursor.execute(
            """
            SELECT COUNT(*) AS review_count,
                   AVG(food_rating) AS food_rating,
                   AVG(service_rating) AS service_rating,
                   AVG(ambiance_rating) AS ambiance_rating,
                   AVG(overall_rating) AS overall_rating,
                   COUNT(*) FILTER (WHERE ROUND(overall_rating) = 5) AS stars_5,
                   COUNT(*) FILTER (WHERE ROUND(overall_rating) = 4) AS stars_4,
                   COUNT(*) FILTER (WHERE ROUND(overall_rating) = 3) AS stars_3,
                   COUNT(*) FILTER (WHERE ROUND(overall_rating) = 2) AS stars_2,
                   COUNT(*) FILTER (WHERE ROUND(overall_rating) <= 1) AS stars_1
            FROM review_restaurant_review
            WHERE restaurant_id = %s
              AND is_flagged = FALSE;
            """,
            [restaurant_id],
        )
        summary_columns = [col[0] for col in cursor.description]
        summary = dict(zip(summary_columns, cursor.fetchone()))

        # The signed-in diner's own review, so the form opens pre-filled.
        my_review = None

        if account_id:
            cursor.execute(
                """
                SELECT *
                FROM review_restaurant_review
                WHERE restaurant_id = %s AND account_id = %s;
                """,
                [restaurant_id, account_id],
            )
            row = cursor.fetchone()

            if row:
                mine_columns = [col[0] for col in cursor.description]
                my_review = dict(zip(mine_columns, row))

        return {"reviews": reviews, "summary": summary, "my_review": my_review}

    except Exception as error:
        print(f"Error: {error}")
        return {"error": str(error)}

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def addRestaurantReview(data):
    try:
        connection = connections['default']
        cursor = connection.cursor()

        account_id = data.get("account_id")
        restaurant_id = data.get("restaurant_id")
        comment = data.get("comment")

        if not account_id:
            return {"error": "account_id is required"}

        if not restaurant_id:
            return {"error": "restaurant_id is required"}

        ratings = {}

        for key in ("food_rating", "service_rating", "ambiance_rating"):
            value = data.get(key)

            if value in (None, ""):
                return {"error": "Rate the food, service and ambiance"}

            try:
                value = float(value)
            except (TypeError, ValueError):
                return {"error": "Ratings must be numbers"}

            if value < 1 or value > 5:
                return {"error": "Ratings must be between 1 and 5"}

            ratings[key] = value

        # The overall score is the average of the three unless the diner set
        # it themselves.
        overall_rating = data.get("overall_rating")

        if overall_rating in (None, ""):
            overall_rating = sum(ratings.values()) / 3
        else:
            try:
                overall_rating = float(overall_rating)
            except (TypeError, ValueError):
                return {"error": "Ratings must be numbers"}

            if overall_rating < 1 or overall_rating > 5:
                return {"error": "Ratings must be between 1 and 5"}

        overall_rating = round(overall_rating, 2)

        cursor.execute(
            """
            SELECT restaurant_name, account_id
            FROM restaurant_restaurant
            WHERE restaurant_id = %s;
            """,
            [restaurant_id],
        )
        restaurant_row = cursor.fetchone()

        if not restaurant_row:
            return {"error": "Restaurant not found"}

        restaurant_name, owner_account_id = restaurant_row

        cursor.execute(
            "SELECT username FROM account_account WHERE account_id = %s;",
            [account_id],
        )
        reviewer_row = cursor.fetchone()

        if not reviewer_row:
            return {"error": "Account not found"}

        reviewer_username = reviewer_row[0]

        # One review per diner per restaurant - a second submission edits the
        # first rather than stacking up.
        cursor.execute(
            """
            SELECT res_review_id
            FROM review_restaurant_review
            WHERE restaurant_id = %s AND account_id = %s;
            """,
            [restaurant_id, account_id],
        )
        existing = cursor.fetchone()

        if existing:
            res_review_id = existing[0]

            cursor.execute(
                """
                UPDATE review_restaurant_review
                SET food_rating = %s,
                    service_rating = %s,
                    ambiance_rating = %s,
                    overall_rating = %s,
                    comment = %s,
                    updated_at = NOW()
                WHERE res_review_id = %s;
                """,
                (
                    ratings["food_rating"],
                    ratings["service_rating"],
                    ratings["ambiance_rating"],
                    overall_rating,
                    comment,
                    res_review_id,
                ),
            )
            message = "Review updated"
            title = "A review was updated"
        else:
            cursor.execute(
                """
                INSERT INTO review_restaurant_review
                    (restaurant_id, account_id, food_rating, service_rating,
                     ambiance_rating, overall_rating, comment, is_flagged,
                     created_at, updated_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, FALSE, NOW(), NOW())
                RETURNING res_review_id;
                """,
                (
                    restaurant_id,
                    account_id,
                    ratings["food_rating"],
                    ratings["service_rating"],
                    ratings["ambiance_rating"],
                    overall_rating,
                    comment,
                ),
            )
            res_review_id = cursor.fetchone()[0]
            message = "Review posted"
            title = "New restaurant review"

        # Tell the owner, unless they are reviewing their own restaurant.
        if str(owner_account_id) != str(account_id):
            cursor.execute(
                """
                INSERT INTO notification_notification
                    (account_id, restaurant_id, title, body, is_read, created_at)
                VALUES (%s, %s, %s, %s, FALSE, NOW());
                """,
                (
                    owner_account_id,
                    restaurant_id,
                    title,
                    f"{reviewer_username} rated {restaurant_name} "
                    f"{overall_rating:.1f} out of 5.",
                ),
            )

        connection.commit()

        return {
            "message": message,
            "res_review_id": res_review_id,
            "overall_rating": overall_rating,
        }

    except IntegrityError as e:
        print(f"Error: {e}")
        return {"error": "Could not save the review"}

    except Exception as error:
        print(f"Error: {error}")
        return {"error": str(error)}

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def deleteRestaurantReview(data):
    try:
        connection = connections['default']
        cursor = connection.cursor()

        res_review_id = data.get("res_review_id")
        account_id = data.get("account_id")

        if not res_review_id or not account_id:
            return {"error": "res_review_id and account_id are required"}

        # Scoped to the author so a diner can only remove their own review.
        cursor.execute(
            """
            DELETE FROM review_restaurant_review
            WHERE res_review_id = %s AND account_id = %s;
            """,
            [res_review_id, account_id],
        )
        connection.commit()

        if cursor.rowcount == 0:
            return {"error": "Review not found"}

        return {"message": "Review deleted"}

    except Exception as error:
        print(f"Error: {error}")
        return {"error": str(error)}

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def getDishReviews(data):
    try:
        connection = connections['default']
        cursor = connection.cursor()

        dish_id = data.get("dish_id")
        account_id = data.get("account_id")

        if not dish_id:
            return {"error": "dish_id is required"}

        cursor.execute(
            """
            SELECT r.*,
                   a.username,
                   a.first_name,
                   a.last_name,
                   a.account_profile_photo
            FROM review_dish_review r
            JOIN account_account a
                ON a.account_id = r.account_id
            WHERE r.dish_id = %s
            ORDER BY r.created_at DESC;
            """,
            [dish_id],
        )

        columns = [col[0] for col in cursor.description]
        reviews = [dict(zip(columns, row)) for row in cursor.fetchall()]

        cursor.execute(
            """
            SELECT COUNT(*) AS review_count,
                   AVG(rating) AS rating,
                   COUNT(*) FILTER (WHERE ROUND(rating) = 5) AS stars_5,
                   COUNT(*) FILTER (WHERE ROUND(rating) = 4) AS stars_4,
                   COUNT(*) FILTER (WHERE ROUND(rating) = 3) AS stars_3,
                   COUNT(*) FILTER (WHERE ROUND(rating) = 2) AS stars_2,
                   COUNT(*) FILTER (WHERE ROUND(rating) <= 1) AS stars_1
            FROM review_dish_review
            WHERE dish_id = %s;
            """,
            [dish_id],
        )
        summary_columns = [col[0] for col in cursor.description]
        summary = dict(zip(summary_columns, cursor.fetchone()))

        my_review = None

        if account_id:
            cursor.execute(
                """
                SELECT *
                FROM review_dish_review
                WHERE dish_id = %s AND account_id = %s;
                """,
                [dish_id, account_id],
            )
            row = cursor.fetchone()

            if row:
                mine_columns = [col[0] for col in cursor.description]
                my_review = dict(zip(mine_columns, row))

        return {"reviews": reviews, "summary": summary, "my_review": my_review}

    except Exception as error:
        print(f"Error: {error}")
        return {"error": str(error)}

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def addDishReview(data):
    try:
        connection = connections['default']
        cursor = connection.cursor()

        account_id = data.get("account_id")
        dish_id = data.get("dish_id")
        rating = data.get("rating")
        comment = data.get("comment")

        if not account_id:
            return {"error": "account_id is required"}

        if not dish_id:
            return {"error": "dish_id is required"}

        if rating in (None, ""):
            return {"error": "Give the dish a rating"}

        try:
            rating = float(rating)
        except (TypeError, ValueError):
            return {"error": "Rating must be a number"}

        if rating < 1 or rating > 5:
            return {"error": "Rating must be between 1 and 5"}

        rating = round(rating, 2)

        # A dish review carries its restaurant too, so the owner's feed can
        # find it without joining back through dish_dish every time.
        cursor.execute(
            """
            SELECT d.restaurant_id, d.dish_name, r.account_id
            FROM dish_dish d
            JOIN restaurant_restaurant r
                ON r.restaurant_id = d.restaurant_id
            WHERE d.dish_id = %s;
            """,
            [dish_id],
        )
        dish_row = cursor.fetchone()

        if not dish_row:
            return {"error": "Dish not found"}

        restaurant_id, dish_name, owner_account_id = dish_row

        cursor.execute(
            "SELECT username FROM account_account WHERE account_id = %s;",
            [account_id],
        )
        reviewer_row = cursor.fetchone()

        if not reviewer_row:
            return {"error": "Account not found"}

        reviewer_username = reviewer_row[0]

        cursor.execute(
            """
            SELECT dish_review_id
            FROM review_dish_review
            WHERE dish_id = %s AND account_id = %s;
            """,
            [dish_id, account_id],
        )
        existing = cursor.fetchone()

        if existing:
            dish_review_id = existing[0]

            cursor.execute(
                """
                UPDATE review_dish_review
                SET rating = %s,
                    comment = %s,
                    updated_at = NOW()
                WHERE dish_review_id = %s;
                """,
                (rating, comment, dish_review_id),
            )
            message = "Review updated"
            title = "A dish review was updated"
        else:
            cursor.execute(
                """
                INSERT INTO review_dish_review
                    (dish_id, restaurant_id, account_id, rating, comment,
                     created_at, updated_at)
                VALUES (%s, %s, %s, %s, %s, NOW(), NOW())
                RETURNING dish_review_id;
                """,
                (dish_id, restaurant_id, account_id, rating, comment),
            )
            dish_review_id = cursor.fetchone()[0]
            message = "Review posted"
            title = "New dish review"

        if str(owner_account_id) != str(account_id):
            cursor.execute(
                """
                INSERT INTO notification_notification
                    (account_id, restaurant_id, title, body, is_read, created_at)
                VALUES (%s, %s, %s, %s, FALSE, NOW());
                """,
                (
                    owner_account_id,
                    restaurant_id,
                    title,
                    f"{reviewer_username} rated {dish_name} {rating:.1f} out of 5.",
                ),
            )

        connection.commit()

        return {
            "message": message,
            "dish_review_id": dish_review_id,
            "rating": rating,
        }

    except IntegrityError as e:
        print(f"Error: {e}")
        return {"error": "Could not save the review"}

    except Exception as error:
        print(f"Error: {error}")
        return {"error": str(error)}

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def deleteDishReview(data):
    try:
        connection = connections['default']
        cursor = connection.cursor()

        dish_review_id = data.get("dish_review_id")
        account_id = data.get("account_id")

        if not dish_review_id or not account_id:
            return {"error": "dish_review_id and account_id are required"}

        cursor.execute(
            """
            DELETE FROM review_dish_review
            WHERE dish_review_id = %s AND account_id = %s;
            """,
            [dish_review_id, account_id],
        )
        connection.commit()

        if cursor.rowcount == 0:
            return {"error": "Review not found"}

        return {"message": "Review deleted"}

    except Exception as error:
        print(f"Error: {error}")
        return {"error": str(error)}

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def getMyReviews(data):
    try:
        connection = connections['default']
        cursor = connection.cursor()

        account_id = data.get("account_id")

        if not account_id:
            return {"error": "account_id is required"}

        cursor.execute(
            """
            SELECT r.*,
                   res.restaurant_name,
                   res.restaurant_logo_img
            FROM review_restaurant_review r
            JOIN restaurant_restaurant res
                ON res.restaurant_id = r.restaurant_id
            WHERE r.account_id = %s
            ORDER BY r.created_at DESC;
            """,
            [account_id],
        )
        columns = [col[0] for col in cursor.description]
        restaurant_reviews = [dict(zip(columns, row)) for row in cursor.fetchall()]

        cursor.execute(
            """
            SELECT r.*,
                   d.dish_name,
                   res.restaurant_name,
                   (
                       SELECT di.dish_image_path
                       FROM dish_dish_images di
                       WHERE di.dish_id = d.dish_id
                       ORDER BY di.is_primary DESC, di.dish_image_id
                       LIMIT 1
                   ) AS dish_image_path
            FROM review_dish_review r
            JOIN dish_dish d
                ON d.dish_id = r.dish_id
            JOIN restaurant_restaurant res
                ON res.restaurant_id = r.restaurant_id
            WHERE r.account_id = %s
            ORDER BY r.created_at DESC;
            """,
            [account_id],
        )
        dish_columns = [col[0] for col in cursor.description]
        dish_reviews = [dict(zip(dish_columns, row)) for row in cursor.fetchall()]

        return {
            "restaurant_reviews": restaurant_reviews,
            "dish_reviews": dish_reviews,
        }

    except Exception as error:
        print(f"Error: {error}")
        return {"error": str(error)}

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def getOwnerReviews(data):
    """Every review left on the signed-in owner's restaurant, newest first."""
    try:
        connection = connections['default']
        cursor = connection.cursor()

        account_id = data.get("account_id")

        if not account_id:
            return {"error": "account_id is required"}

        cursor.execute(
            """
            SELECT restaurant_id
            FROM restaurant_restaurant
            WHERE account_id = %s
            ORDER BY restaurant_id DESC
            LIMIT 1;
            """,
            [account_id],
        )
        row = cursor.fetchone()

        if not row:
            return {"reviews": [], "summary": None}

        restaurant_id = row[0]

        # Restaurant reviews and dish reviews in one list, tagged by kind so
        # the screen can render them with the same card.
        cursor.execute(
            """
            SELECT 'restaurant' AS review_kind,
                   r.res_review_id AS review_id,
                   r.overall_rating AS rating,
                   r.comment,
                   r.created_at,
                   NULL AS dish_name,
                   a.username,
                   a.first_name,
                   a.last_name,
                   a.account_profile_photo
            FROM review_restaurant_review r
            JOIN account_account a
                ON a.account_id = r.account_id
            WHERE r.restaurant_id = %s

            UNION ALL

            SELECT 'dish' AS review_kind,
                   r.dish_review_id AS review_id,
                   r.rating,
                   r.comment,
                   r.created_at,
                   d.dish_name,
                   a.username,
                   a.first_name,
                   a.last_name,
                   a.account_profile_photo
            FROM review_dish_review r
            JOIN dish_dish d
                ON d.dish_id = r.dish_id
            JOIN account_account a
                ON a.account_id = r.account_id
            WHERE r.restaurant_id = %s

            ORDER BY created_at DESC;
            """,
            [restaurant_id, restaurant_id],
        )
        columns = [col[0] for col in cursor.description]
        reviews = [dict(zip(columns, row)) for row in cursor.fetchall()]

        cursor.execute(
            """
            SELECT COUNT(*) AS review_count,
                   AVG(food_rating) AS food_rating,
                   AVG(service_rating) AS service_rating,
                   AVG(ambiance_rating) AS ambiance_rating,
                   AVG(overall_rating) AS overall_rating,
                   COUNT(*) FILTER (WHERE ROUND(overall_rating) = 5) AS stars_5,
                   COUNT(*) FILTER (WHERE ROUND(overall_rating) = 4) AS stars_4,
                   COUNT(*) FILTER (WHERE ROUND(overall_rating) = 3) AS stars_3,
                   COUNT(*) FILTER (WHERE ROUND(overall_rating) = 2) AS stars_2,
                   COUNT(*) FILTER (WHERE ROUND(overall_rating) <= 1) AS stars_1
            FROM review_restaurant_review
            WHERE restaurant_id = %s;
            """,
            [restaurant_id],
        )
        summary_columns = [col[0] for col in cursor.description]
        summary = dict(zip(summary_columns, cursor.fetchone()))

        return {
            "restaurant_id": restaurant_id,
            "reviews": reviews,
            "summary": summary,
        }

    except Exception as error:
        print(f"Error: {error}")
        return {"error": str(error)}

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()
