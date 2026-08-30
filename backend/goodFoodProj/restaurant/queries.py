import json

from django.db import connections, IntegrityError
from django.core.files.storage import default_storage


def getRestaurantInfo(data):
    try:
        connection = connections['default']
        cursor = connection.cursor()

        account_id = data.get("account_id")

        query = """
            SELECT *
            FROM restaurant_restaurant
            WHERE account_id = %s
            ORDER BY restaurant_id DESC
            LIMIT 1;
        """

        cursor.execute(query, [account_id])
        row = cursor.fetchone()

        if not row:
            return {
                "restaurant": None,
                "location": None,
                "operating_hours": [],
                "categories": [],
                "branches": [],
            }

        columns = [col[0] for col in cursor.description]
        restaurant = dict(zip(columns, row))

        restaurant_id = restaurant["restaurant_id"]

        location = None

        if restaurant["location_id"]:
            location_query = """
                SELECT *
                FROM location_location
                WHERE location_id = %s;
            """

            cursor.execute(location_query, [restaurant["location_id"]])
            location_row = cursor.fetchone()

            if location_row:
                location_columns = [col[0] for col in cursor.description]
                location = dict(zip(location_columns, location_row))

        # Operating hours (one row per saved day).
        cursor.execute(
            """
            SELECT *
            FROM restaurant_operating_hours
            WHERE restaurant_id = %s
            ORDER BY operating_hours_id;
            """,
            [restaurant_id],
        )
        hours_columns = [col[0] for col in cursor.description]
        operating_hours = [dict(zip(hours_columns, r)) for r in cursor.fetchall()]

        # Cuisine categories linked to this restaurant.
        cursor.execute(
            """
            SELECT c.category_id, c.category_name
            FROM restaurant_category c
            JOIN restaurant_restaurant_category rc
                ON rc.category_id = c.category_id
            WHERE rc.restaurant_id = %s
            ORDER BY c.category_name;
            """,
            [restaurant_id],
        )
        category_columns = [col[0] for col in cursor.description]
        categories = [dict(zip(category_columns, r)) for r in cursor.fetchall()]

        # Branches.
        cursor.execute(
            """
            SELECT *
            FROM restaurant_restaurant_branch
            WHERE restaurant_id = %s
            ORDER BY branch_id;
            """,
            [restaurant_id],
        )
        branch_columns = [col[0] for col in cursor.description]
        branches = [dict(zip(branch_columns, r)) for r in cursor.fetchall()]

        return {
            "restaurant": restaurant,
            "location": location,
            "operating_hours": operating_hours,
            "categories": categories,
            "branches": branches,
        }

    except Exception as error:
        print(f"Error: {error}")
        return {"error": str(error)}

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def addRestaurantInfo(data):
    try:
        connection = connections['default']
        cursor = connection.cursor()

        account_id = data.get("account_id")
        restaurant_name = data.get("restaurant_name")
        restaurant_description = data.get("restaurant_description")
        address = data.get("address")
        contact_number = data.get("contact_number")
        email = data.get("email")

        city = data.get("city")
        province = data.get("province")
        region = data.get("region")
        country = data.get("country")
        latitude = data.get("latitude")
        longitude = data.get("longitude")

        # Operating hours / categories / branches arrive as JSON strings because
        # the request is multipart. Parse them, defaulting to an empty list.
        operating_hours = data.get("operating_hours")
        if operating_hours:
            try:
                operating_hours = json.loads(operating_hours)
            except (TypeError, ValueError):
                operating_hours = []
        else:
            operating_hours = []

        categories = data.get("categories")
        if categories:
            try:
                categories = json.loads(categories)
            except (TypeError, ValueError):
                categories = []
        else:
            categories = []

        branches = data.get("branches")
        if branches:
            try:
                branches = json.loads(branches)
            except (TypeError, ValueError):
                branches = []
        else:
            branches = []

        if not account_id:
            return {"error": "account_id is required"}

        if not restaurant_name or not address or not contact_number or not email:
            return {"error": "Restaurant name, address, contact number and email are required"}

        # Save the uploaded images. A raw file object cannot be passed to SQL,
        # so store it through Django and keep only the path.
        logo_path = None
        logo_file = data.get("restaurant_logo_img")
        if logo_file is not None and hasattr(logo_file, "read"):
            logo_path = default_storage.save(
                f"restaurant_logo_photos/{logo_file.name}", logo_file
            )

        cover_path = None
        cover_file = data.get("restaurant_cover_img")
        if cover_file is not None and hasattr(cover_file, "read"):
            cover_path = default_storage.save(
                f"restaurant_cover_photos/{cover_file.name}", cover_file
            )

        # Check if this account already has a restaurant.
        cursor.execute(
            """
            SELECT restaurant_id, location_id
            FROM restaurant_restaurant
            WHERE account_id = %s
            ORDER BY restaurant_id DESC
            LIMIT 1;
            """,
            [account_id],
        )
        existing = cursor.fetchone()

        if existing:
            restaurant_id = existing[0]
            location_id = existing[1]

            # Update the location, or create one if the restaurant had none.
            if location_id:
                cursor.execute(
                    """
                    UPDATE location_location
                    SET city = %s,
                        province = %s,
                        region = %s,
                        country = %s,
                        latitude = %s,
                        longitude = %s
                    WHERE location_id = %s;
                    """,
                    (city, province, region, country, latitude, longitude, location_id),
                )
            else:
                cursor.execute(
                    """
                    INSERT INTO location_location
                        (city, province, region, country, latitude, longitude)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    RETURNING location_id;
                    """,
                    (city, province, region, country, latitude, longitude),
                )
                location_id = cursor.fetchone()[0]

            # Update the restaurant. COALESCE keeps the current image when no
            # new file was uploaded.
            cursor.execute(
                """
                UPDATE restaurant_restaurant
                SET restaurant_name = %s,
                    restaurant_description = %s,
                    address = %s,
                    contact_number = %s,
                    email = %s,
                    location_id = %s,
                    restaurant_logo_img = COALESCE(%s, restaurant_logo_img),
                    restaurant_cover_img = COALESCE(%s, restaurant_cover_img),
                    updated_at = NOW()
                WHERE restaurant_id = %s;
                """,
                (
                    restaurant_name,
                    restaurant_description,
                    address,
                    contact_number,
                    email,
                    location_id,
                    logo_path,
                    cover_path,
                    restaurant_id,
                ),
            )
        else:
            # Create the location first, then the restaurant that points to it.
            cursor.execute(
                """
                INSERT INTO location_location
                    (city, province, region, country, latitude, longitude)
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING location_id;
                """,
                (city, province, region, country, latitude, longitude),
            )
            location_id = cursor.fetchone()[0]

            cursor.execute(
                """
                INSERT INTO restaurant_restaurant
                    (account_id, location_id, restaurant_name, restaurant_description,
                     address, contact_number, email, created_at, updated_at,
                     restaurant_logo_img, restaurant_cover_img)
                VALUES (%s, %s, %s, %s, %s, %s, %s, NOW(), NOW(), %s, %s)
                RETURNING restaurant_id;
                """,
                (
                    account_id,
                    location_id,
                    restaurant_name,
                    restaurant_description,
                    address,
                    contact_number,
                    email,
                    logo_path,
                    cover_path,
                ),
            )
            restaurant_id = cursor.fetchone()[0]

        # Replace the operating hours with what was sent (only when the field
        # was part of the request).
        if "operating_hours" in data:
            cursor.execute(
                "DELETE FROM restaurant_operating_hours WHERE restaurant_id = %s;",
                [restaurant_id],
            )
            for item in operating_hours:
                day_of_week = (item.get("day_of_week") or "").strip()
                if not day_of_week:
                    continue

                is_closed = bool(item.get("is_closed"))
                opening_time = (item.get("opening_time") or "").strip() or None
                closing_time = (item.get("closing_time") or "").strip() or None

                if is_closed:
                    opening_time = None
                    closing_time = None
                elif not opening_time or not closing_time:
                    continue

                cursor.execute(
                    """
                    INSERT INTO restaurant_operating_hours
                        (restaurant_id, day_of_week, opening_time, closing_time, is_closed)
                    VALUES (%s, %s, %s, %s, %s);
                    """,
                    (restaurant_id, day_of_week, opening_time, closing_time, is_closed),
                )

        # Replace the linked categories. Category names are shared across
        # restaurants, so create any that do not exist yet.
        if "categories" in data:
            cursor.execute(
                "DELETE FROM restaurant_restaurant_category WHERE restaurant_id = %s;",
                [restaurant_id],
            )
            for name in categories:
                name = (name or "").strip()
                if not name:
                    continue

                cursor.execute(
                    """
                    INSERT INTO restaurant_category (category_name)
                    VALUES (%s)
                    ON CONFLICT (category_name) DO NOTHING;
                    """,
                    [name],
                )
                cursor.execute(
                    "SELECT category_id FROM restaurant_category WHERE category_name = %s;",
                    [name],
                )
                category_id = cursor.fetchone()[0]

                cursor.execute(
                    """
                    INSERT INTO restaurant_restaurant_category (restaurant_id, category_id)
                    VALUES (%s, %s)
                    ON CONFLICT (restaurant_id, category_id) DO NOTHING;
                    """,
                    (restaurant_id, category_id),
                )

        # Replace the branches.
        if "branches" in data:
            cursor.execute(
                "DELETE FROM restaurant_restaurant_branch WHERE restaurant_id = %s;",
                [restaurant_id],
            )
            for item in branches:
                branch_name = (item.get("branch_name") or "").strip()
                branch_address = (item.get("address") or "").strip()
                branch_contact = (item.get("contact_number") or "").strip()

                if not branch_name or not branch_address or not branch_contact:
                    continue

                cursor.execute(
                    """
                    INSERT INTO restaurant_restaurant_branch
                        (restaurant_id, branch_name, address, contact_number,
                         latitude, longitude, created_at)
                    VALUES (%s, %s, %s, %s, %s, %s, NOW());
                    """,
                    (
                        restaurant_id,
                        branch_name,
                        branch_address,
                        branch_contact,
                        (item.get("latitude") or "").strip() or None,
                        (item.get("longitude") or "").strip() or None,
                    ),
                )

        connection.commit()

        return {"message": "Restaurant information saved"}

    except IntegrityError as e:
        error_msg = str(e)

        if "email" in error_msg:
            return {"error": "That email is already used by another restaurant"}

        return {"error": "Duplicate data detected"}

    except Exception as error:
        print(f"Error: {error}")
        return {"error": str(error)}

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()
