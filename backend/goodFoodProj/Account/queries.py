from django.db import connections
import logging
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import make_password, check_password
from rest_framework_simplejwt.tokens import RefreshToken
from django.db import connections, IntegrityError

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

        query = """
            SELECT account_id, username, password
            FROM account_account
            WHERE username = %s;
        """

        cursor.execute(query, [username])
        row = cursor.fetchone()

        if not row:
            return {"error": "User not found"}

        account_id, username, hashed_password = row

        if not check_password(password, hashed_password):
            return {"error": "Invalid Password"}

        refresh = RefreshToken()
        refresh["account_id"] = account_id
        refresh["username"] = username

        return {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "account_id": account_id,
                "username": username,
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
