from django.db import connections


def getNotifications(data):
    try:
        connection = connections['default']
        cursor = connection.cursor()

        account_id = data.get("account_id")

        if not account_id:
            return {"error": "account_id is required"}

        # The restaurant name comes along so a diner's notification can say
        # which restaurant it came from.
        cursor.execute(
            """
            SELECT n.*,
                   r.restaurant_name,
                   r.restaurant_logo_img
            FROM notification_notification n
            LEFT JOIN restaurant_restaurant r
                ON r.restaurant_id = n.restaurant_id
            WHERE n.account_id = %s
            ORDER BY n.created_at DESC
            LIMIT 100;
            """,
            [account_id],
        )

        columns = [col[0] for col in cursor.description]
        notifications = [dict(zip(columns, row)) for row in cursor.fetchall()]

        unread_count = sum(1 for n in notifications if not n["is_read"])

        return {"notifications": notifications, "unread_count": unread_count}

    except Exception as error:
        print(f"Error: {error}")
        return {"error": str(error)}

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def getUnreadCount(data):
    """Just the badge number, for screens that don't render the list."""
    try:
        connection = connections['default']
        cursor = connection.cursor()

        account_id = data.get("account_id")

        if not account_id:
            return {"error": "account_id is required"}

        cursor.execute(
            """
            SELECT COUNT(*)
            FROM notification_notification
            WHERE account_id = %s AND is_read = FALSE;
            """,
            [account_id],
        )

        return {"unread_count": cursor.fetchone()[0]}

    except Exception as error:
        print(f"Error: {error}")
        return {"error": str(error)}

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def addNotification(data):
    try:
        connection = connections['default']
        cursor = connection.cursor()

        account_id = data.get("account_id")
        restaurant_id = data.get("restaurant_id") or None
        title = data.get("title")
        body = data.get("body")

        if not account_id:
            return {"error": "account_id is required"}

        if not title:
            return {"error": "title is required"}

        cursor.execute(
            """
            INSERT INTO notification_notification
                (account_id, restaurant_id, title, body, is_read, created_at)
            VALUES (%s, %s, %s, %s, FALSE, NOW())
            RETURNING notification_id;
            """,
            (account_id, restaurant_id, title, body),
        )
        notification_id = cursor.fetchone()[0]
        connection.commit()

        return {"message": "Notification sent", "notification_id": notification_id}

    except Exception as error:
        print(f"Error: {error}")
        return {"error": str(error)}

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def markNotificationRead(data):
    try:
        connection = connections['default']
        cursor = connection.cursor()

        notification_id = data.get("notification_id")
        account_id = data.get("account_id")

        if not notification_id or not account_id:
            return {"error": "notification_id and account_id are required"}

        # Scoped to the owner of the notification so one account can't mark
        # another's as read.
        cursor.execute(
            """
            UPDATE notification_notification
            SET is_read = TRUE
            WHERE notification_id = %s AND account_id = %s;
            """,
            [notification_id, account_id],
        )
        connection.commit()

        if cursor.rowcount == 0:
            return {"error": "Notification not found"}

        return {"message": "Notification marked as read"}

    except Exception as error:
        print(f"Error: {error}")
        return {"error": str(error)}

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def markAllNotificationsRead(data):
    try:
        connection = connections['default']
        cursor = connection.cursor()

        account_id = data.get("account_id")

        if not account_id:
            return {"error": "account_id is required"}

        cursor.execute(
            """
            UPDATE notification_notification
            SET is_read = TRUE
            WHERE account_id = %s AND is_read = FALSE;
            """,
            [account_id],
        )
        connection.commit()

        return {"message": "All notifications marked as read", "updated": cursor.rowcount}

    except Exception as error:
        print(f"Error: {error}")
        return {"error": str(error)}

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def deleteNotification(data):
    try:
        connection = connections['default']
        cursor = connection.cursor()

        notification_id = data.get("notification_id")
        account_id = data.get("account_id")

        if not notification_id or not account_id:
            return {"error": "notification_id and account_id are required"}

        cursor.execute(
            """
            DELETE FROM notification_notification
            WHERE notification_id = %s AND account_id = %s;
            """,
            [notification_id, account_id],
        )
        connection.commit()

        if cursor.rowcount == 0:
            return {"error": "Notification not found"}

        return {"message": "Notification deleted"}

    except Exception as error:
        print(f"Error: {error}")
        return {"error": str(error)}

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()
