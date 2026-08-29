from django.db import connections
import logging
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import make_password, check_password
from rest_framework_simplejwt.tokens import RefreshToken
from django.db import connections, IntegrityError
from django.core.files.storage import default_storage

def getAccountType():
    try:
        connection = connections['default']
        cursor = connection.cursor()
        
        query = """
                SELECT * FROM account_accounttype;
                """

        cursor.execute(query)

        results = [
            dict(
                (cursor.description[i][0], value if value is not None else "")
                for i, value in enumerate(row)
            )
            for row in cursor.fetchall()
        ]
        #print(results) 
        return results

    except Exception as error:
        print(f"Error: {error}")
    finally:        
        if cursor:
            cursor.close()
        if connection:
            connection.close()

def registerAccount(data):
    try:
        connection = connections['default']
        cursor = connection.cursor()

        hashed_password = make_password(data.get("password"))

        query = """
            INSERT INTO account_account
            (
                username,
                email_address,
                password,
                mobile_number,
                account_type_id
            )
            VALUES (%s, %s, %s, %s, %s);
        """

        params = (
            data.get("username"),
            data.get("email_address"),
            hashed_password,
            data.get("mobile_number"),
            data.get("account_type"),
        )

        cursor.execute(query, params)
        connection.commit()

        return {"message": "Account registered successfully"}

    except IntegrityError as e:
        error_msg = str(e)

        if "mobile_number" in error_msg:
            return {"error": "Mobile number already registered"}

        if "username" in error_msg:
            return {"error": "Username already taken"}

        if "email_address" in error_msg:
            return {"error": "Email already registered"}

        return {"error": "Duplicate data detected"}

    except Exception as error:
        print(f"Register Error: {error}")
        return {"error": "Something went wrong"}

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

def login(data):
    try:
        connection = connections['default']
        cursor = connection.cursor()

        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return {"error": "Username and password required"}

        query = """
            SELECT *
            FROM account_account a
            JOIN account_accounttype at 
            ON a.account_type_id = at.acc_type_id
            WHERE a.username = %s;
        """

        cursor.execute(query, [username])
        row = cursor.fetchone()

        if not row:
            return {"error": "User not found"}

        columns = [col[0] for col in cursor.description]
        user = dict(zip(columns, row))

        if not check_password(password, user["password"]):
            return {"error": "Invalid Password"}

        refresh = RefreshToken()
        refresh["user_id"] = user["account_id"]
        refresh["account_id"] = user["account_id"]
        refresh["username"] = user["username"]

        return {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "account_id": user["account_id"],
                "username": user["username"],
                "first_name": user["first_name"],
                "last_name": user["last_name"],
                "gender": user["gender"],
                "birthdate": user["birthdate"],
                "email_address": user["email_address"],
                "mobile_number": user["mobile_number"],
                "account_profile_photo": user["account_profile_photo"],
                "account_type": user["account_type"],
            },
        }

    except Exception as error:
        return {"error": str(error)}

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

def logout(data):
    try:
        connection = connections['default']
        cursor = connection.cursor()
        
        refresh_token = data.get("refresh")
        token = RefreshToken(refresh_token)
        token.blacklist()
        return {"message": "Logged out successfully"}

    except Exception as e:
        return {"error": "Invalid token"}
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

def checkInfoIfComplete(data):
    connection = None
    cursor = None

    try:
        account_id = data.get("account_id")

        with connections["default"].cursor() as cursor:
            query = """
                SELECT
                    (
                        first_name IS NOT NULL AND first_name != '' AND
                        last_name IS NOT NULL AND last_name != '' AND
                        gender IS NOT NULL AND gender != '' AND
                        birthdate IS NOT NULL AND
                        mobile_number IS NOT NULL AND mobile_number != ''
                    ) AS personal_info_complete,

                    EXISTS (
                        SELECT 1
                        FROM restaurant_restaurant rr
                        WHERE rr.account_id = aa.account_id
                    ) AS restaurant_info_complete

                FROM account_account aa
                WHERE aa.account_id = %s;
            """

            cursor.execute(query, [account_id])
            row = cursor.fetchone()

        if not row:
            return {
                "personal_info_complete": False,
                "restaurant_info_complete": False,
            }

        return {
            "personal_info_complete": row[0],
            "restaurant_info_complete": row[1],
        }

    except Exception as error:
        print(f"Error: {error}")
        return {
            "personal_info_complete": False,
            "restaurant_info_complete": False,
        }

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

def addAdditionalInfo(data):
    connection = None
    cursor = None
    try:
        account_id = data.get('account_id')
        if not account_id:
            return {"error": "account_id is required"}

        # Persist the upload through Django storage and keep only the path in
        # the DB. A raw file object cannot be passed as a SQL parameter.
        profile_photo_path = None
        uploaded = data.get('profile_image')
        if uploaded is not None and hasattr(uploaded, 'read'):
            profile_photo_path = default_storage.save(
                f"account_photos/{uploaded.name}", uploaded
            )

        connection = connections['default']
        cursor = connection.cursor()

        query = """
            UPDATE account_account
            SET
                first_name = %s,
                last_name = %s,
                birthdate = %s,
                gender = %s,
                account_profile_photo = COALESCE(%s, account_profile_photo)
            WHERE account_id = %s
            RETURNING account_id, username, first_name, last_name, gender,
                      birthdate, email_address, mobile_number,
                      account_profile_photo;
        """

        params = (
            data.get('firstname'),
            data.get('lastname'),
            data.get('birthdate'),
            data.get('gender'),
            profile_photo_path,
            account_id,
        )

        cursor.execute(query, params)
        row = cursor.fetchone()
        connection.commit()

        if not row:
            return {"error": "Account not found"}

        columns = [col[0] for col in cursor.description]
        updated_user = dict(zip(columns, row))

        return {
            "message": "Account updated with additional info",
            "user": updated_user,
        }

    except Exception as error:
        print(f"Error: {error}")
        return {"error": str(error)}

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()