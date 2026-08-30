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
            ORDER BY id DESC
            LIMIT 1;
        """

        cursor.execute(query, [account_id])
        row = cursor.fetchone()

        if not row:
            return {"restaurant": None, "location": None}

        columns = [col[0] for col in cursor.description]
        restaurant = dict(zip(columns, row))

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

        return {"restaurant": restaurant, "location": location}

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
            SELECT id, location_id
            FROM restaurant_restaurant
            WHERE account_id = %s
            ORDER BY id DESC
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
                    restaurant_cover_img = COALESCE(%s, restaurant_cover_img)
                WHERE id = %s;
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
                     address, contact_number, email, created_at,
                     restaurant_logo_img, restaurant_cover_img)
                VALUES (%s, %s, %s, %s, %s, %s, %s, NOW(), %s, %s);
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
