from django.db import connections, IntegrityError
from django.core.files.storage import default_storage


def getDishCategories(data):
    try:
        connection = connections['default']
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT *
            FROM dish_dish_category
            ORDER BY dish_category_name;
            """
        )

        columns = [col[0] for col in cursor.description]
        categories = [dict(zip(columns, row)) for row in cursor.fetchall()]

        return {"categories": categories}

    except Exception as error:
        print(f"Error: {error}")
        return {"error": str(error)}

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def addDishCategory(data):
    try:
        connection = connections['default']
        cursor = connection.cursor()

        dish_category_name = data.get("dish_category_name")
        dish_category_description = data.get("dish_category_description")

        if not dish_category_name:
            return {"error": "Category name is required"}

        cursor.execute(
            """
            INSERT INTO dish_dish_category
                (dish_category_name, dish_category_description)
            VALUES (%s, %s)
            RETURNING dish_category_id;
            """,
            (dish_category_name, dish_category_description),
        )
        dish_category_id = cursor.fetchone()[0]
        connection.commit()

        return {
            "message": "Dish category added",
            "dish_category_id": dish_category_id,
        }

    except Exception as error:
        print(f"Error: {error}")
        return {"error": str(error)}

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def getDishes(data):
    try:
        connection = connections['default']
        cursor = connection.cursor()

        account_id = data.get("account_id")

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
            return {"dishes": []}

        restaurant_id = row[0]

        cursor.execute(
            """
            SELECT d.*,
                   c.dish_category_name,
                   (
                       SELECT di.dish_image_path
                       FROM dish_dish_images di
                       WHERE di.dish_id = d.dish_id
                       ORDER BY di.is_primary DESC, di.dish_image_id
                       LIMIT 1
                   ) AS dish_image_path
            FROM dish_dish d
            LEFT JOIN dish_dish_category c
                ON c.dish_category_id = d.dish_category_id
            WHERE d.restaurant_id = %s
            ORDER BY d.dish_id DESC;
            """,
            [restaurant_id],
        )

        columns = [col[0] for col in cursor.description]
        dishes = [dict(zip(columns, r)) for r in cursor.fetchall()]

        return {"dishes": dishes}

    except Exception as error:
        print(f"Error: {error}")
        return {"error": str(error)}

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def getDish(data):
    try:
        connection = connections['default']
        cursor = connection.cursor()

        dish_id = data.get("dish_id")

        if not dish_id:
            return {"error": "dish_id is required"}

        cursor.execute(
            """
            SELECT d.*,
                   c.dish_category_name,
                   r.restaurant_name
            FROM dish_dish d
            LEFT JOIN dish_dish_category c
                ON c.dish_category_id = d.dish_category_id
            JOIN restaurant_restaurant r
                ON r.restaurant_id = d.restaurant_id
            WHERE d.dish_id = %s;
            """,
            [dish_id],
        )
        row = cursor.fetchone()

        if not row:
            return {"dish": None, "images": []}

        columns = [col[0] for col in cursor.description]
        dish = dict(zip(columns, row))

        cursor.execute(
            """
            SELECT *
            FROM dish_dish_images
            WHERE dish_id = %s
            ORDER BY is_primary DESC, dish_image_id;
            """,
            [dish_id],
        )
        image_columns = [col[0] for col in cursor.description]
        images = [dict(zip(image_columns, r)) for r in cursor.fetchall()]

        return {"dish": dish, "images": images}

    except Exception as error:
        print(f"Error: {error}")
        return {"error": str(error)}

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def addDish(data):
    try:
        connection = connections['default']
        cursor = connection.cursor()

        account_id = data.get("account_id")
        dish_name = data.get("dish_name")
        dish_description = data.get("dish_description")
        dish_price = data.get("dish_price")
        dish_category_id = data.get("dish_category_id") or None
        preparation_notes = data.get("preparation_notes")
        how_to_eat = data.get("how_to_eat")

        true_values = ("true", "1", "yes", "on")
        is_signature = str(data.get("is_signature")).strip().lower() in true_values
        is_best_seller = str(data.get("is_best_seller")).strip().lower() in true_values
        is_available = str(data.get("is_available")).strip().lower() in true_values

        if not account_id:
            return {"error": "account_id is required"}

        if not dish_name or dish_price in (None, ""):
            return {"error": "Dish name and price are required"}

        try:
            dish_price = float(dish_price)
        except (TypeError, ValueError):
            return {"error": "Price must be a number"}

        # A dish belongs to the account's restaurant.
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
            return {"error": "Add your restaurant information first"}

        restaurant_id = row[0]

        # Save the uploaded photo (if any) through Django storage.
        image_path = None
        image_file = data.get("dish_image")
        if image_file is not None and hasattr(image_file, "read"):
            image_path = default_storage.save(
                f"dish_photos/{image_file.name}", image_file
            )

        cursor.execute(
            """
            INSERT INTO dish_dish
                (restaurant_id, dish_category_id, dish_name, dish_description,
                 dish_price, is_signature, is_best_seller, is_available,
                 preparation_notes, how_to_eat, created_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW())
            RETURNING dish_id;
            """,
            (
                restaurant_id,
                dish_category_id,
                dish_name,
                dish_description,
                dish_price,
                is_signature,
                is_best_seller,
                is_available,
                preparation_notes,
                how_to_eat,
            ),
        )
        dish_id = cursor.fetchone()[0]

        if image_path:
            cursor.execute(
                """
                INSERT INTO dish_dish_images
                    (dish_id, dish_image_path, caption, is_primary, created_at)
                VALUES (%s, %s, %s, %s, NOW());
                """,
                (dish_id, image_path, None, True),
            )

        connection.commit()

        return {"message": "Dish added", "dish_id": dish_id}

    except IntegrityError as e:
        print(f"Error: {e}")
        return {"error": "Could not save the dish"}

    except Exception as error:
        print(f"Error: {error}")
        return {"error": str(error)}

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def updateDish(data):
    try:
        connection = connections['default']
        cursor = connection.cursor()

        dish_id = data.get("dish_id")
        dish_name = data.get("dish_name")
        dish_description = data.get("dish_description")
        dish_price = data.get("dish_price")
        dish_category_id = data.get("dish_category_id") or None
        preparation_notes = data.get("preparation_notes")
        how_to_eat = data.get("how_to_eat")

        true_values = ("true", "1", "yes", "on")
        is_signature = str(data.get("is_signature")).strip().lower() in true_values
        is_best_seller = str(data.get("is_best_seller")).strip().lower() in true_values
        is_available = str(data.get("is_available")).strip().lower() in true_values

        if not dish_id:
            return {"error": "dish_id is required"}

        if not dish_name or dish_price in (None, ""):
            return {"error": "Dish name and price are required"}

        try:
            dish_price = float(dish_price)
        except (TypeError, ValueError):
            return {"error": "Price must be a number"}

        # Save a new photo if one was sent, and make it the primary image.
        image_path = None
        image_file = data.get("dish_image")
        if image_file is not None and hasattr(image_file, "read"):
            image_path = default_storage.save(
                f"dish_photos/{image_file.name}", image_file
            )

        cursor.execute(
            """
            UPDATE dish_dish
            SET dish_category_id = %s,
                dish_name = %s,
                dish_description = %s,
                dish_price = %s,
                is_signature = %s,
                is_best_seller = %s,
                is_available = %s,
                preparation_notes = %s,
                how_to_eat = %s
            WHERE dish_id = %s;
            """,
            (
                dish_category_id,
                dish_name,
                dish_description,
                dish_price,
                is_signature,
                is_best_seller,
                is_available,
                preparation_notes,
                how_to_eat,
                dish_id,
            ),
        )

        if cursor.rowcount == 0:
            return {"error": "Dish not found"}

        if image_path:
            cursor.execute(
                "UPDATE dish_dish_images SET is_primary = FALSE WHERE dish_id = %s;",
                [dish_id],
            )
            cursor.execute(
                """
                INSERT INTO dish_dish_images
                    (dish_id, dish_image_path, caption, is_primary, created_at)
                VALUES (%s, %s, %s, %s, NOW());
                """,
                (dish_id, image_path, None, True),
            )

        connection.commit()

        return {"message": "Dish updated", "dish_id": dish_id}

    except Exception as error:
        print(f"Error: {error}")
        return {"error": str(error)}

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def deleteDish(data):
    try:
        connection = connections['default']
        cursor = connection.cursor()

        dish_id = data.get("dish_id")

        if not dish_id:
            return {"error": "dish_id is required"}

        cursor.execute("DELETE FROM dish_dish WHERE dish_id = %s;", [dish_id])
        connection.commit()

        if cursor.rowcount == 0:
            return {"error": "Dish not found"}

        return {"message": "Dish deleted"}

    except Exception as error:
        print(f"Error: {error}")
        return {"error": str(error)}

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def updateDishCategory(data):
    try:
        connection = connections['default']
        cursor = connection.cursor()

        dish_category_id = data.get("dish_category_id")
        dish_category_name = data.get("dish_category_name")
        dish_category_description = data.get("dish_category_description")

        if not dish_category_id:
            return {"error": "dish_category_id is required"}

        if not dish_category_name:
            return {"error": "Category name is required"}

        cursor.execute(
            """
            UPDATE dish_dish_category
            SET dish_category_name = %s,
                dish_category_description = %s
            WHERE dish_category_id = %s;
            """,
            (dish_category_name, dish_category_description, dish_category_id),
        )
        connection.commit()

        if cursor.rowcount == 0:
            return {"error": "Category not found"}

        return {"message": "Dish category updated"}

    except Exception as error:
        print(f"Error: {error}")
        return {"error": str(error)}

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def deleteDishCategory(data):
    try:
        connection = connections['default']
        cursor = connection.cursor()

        dish_category_id = data.get("dish_category_id")

        if not dish_category_id:
            return {"error": "dish_category_id is required"}

        # Dish.dish_category is ON DELETE SET NULL, so dishes in this category
        # simply become uncategorised.
        cursor.execute(
            "DELETE FROM dish_dish_category WHERE dish_category_id = %s;",
            [dish_category_id],
        )
        connection.commit()

        if cursor.rowcount == 0:
            return {"error": "Category not found"}

        return {"message": "Dish category deleted"}

    except Exception as error:
        print(f"Error: {error}")
        return {"error": str(error)}

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()
