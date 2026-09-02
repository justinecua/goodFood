from django.db import connections, IntegrityError

# A conversation always has exactly two sides: the diner
# (messaging_conversation.account_id) and the restaurant's owner
# (restaurant_restaurant.account_id). Every query below resolves the signed-in
# account against those two columns rather than taking a role from the client.


def getConversations(data):
    try:
        connection = connections['default']
        cursor = connection.cursor()

        account_id = data.get("account_id")
        search = (data.get("search") or "").strip()

        if not account_id:
            return {"error": "account_id is required"}

        # Searching looks at the name on the row and at every message in the
        # thread, not just the preview - typing a word you remember saying
        # should find the conversation you said it in.
        search_filter = ""
        search_params = []

        if search:
            search_filter = """
                WHERE t.counterpart_name ILIKE %s
                   OR EXISTS (
                          SELECT 1
                          FROM messaging_message m
                          WHERE m.conversation_id = t.conversation_id
                            AND m.message ILIKE %s
                      )
            """
            search_params = [f"%{search}%", f"%{search}%"]

        # The row shows whoever the signed-in account is NOT: a diner sees the
        # restaurant, an owner sees the diner who wrote in.
        cursor.execute(
            f"""
            WITH threads AS (
            SELECT c.conversation_id,
                   c.status,
                   c.created_at,
                   c.restaurant_id,
                   c.account_id AS diner_account_id,
                   r.account_id AS owner_account_id,
                   CASE WHEN c.account_id = %s THEN 'diner' ELSE 'owner' END AS my_role,
                   CASE WHEN c.account_id = %s
                        THEN r.restaurant_name
                        ELSE COALESCE(
                            NULLIF(TRIM(CONCAT(a.first_name, ' ', a.last_name)), ''),
                            a.username
                        )
                   END AS counterpart_name,
                   CASE WHEN c.account_id = %s
                        THEN r.restaurant_logo_img
                        ELSE a.account_profile_photo
                   END AS counterpart_photo,
                   (
                       SELECT m.message
                       FROM messaging_message m
                       WHERE m.conversation_id = c.conversation_id
                       ORDER BY m.sent_at DESC, m.message_id DESC
                       LIMIT 1
                   ) AS last_message,
                   (
                       SELECT m.sent_at
                       FROM messaging_message m
                       WHERE m.conversation_id = c.conversation_id
                       ORDER BY m.sent_at DESC, m.message_id DESC
                       LIMIT 1
                   ) AS last_message_at,
                   (
                       SELECT COUNT(*)
                       FROM messaging_message m
                       WHERE m.conversation_id = c.conversation_id
                         AND m.sender_id <> %s
                         AND m.is_read = FALSE
                   ) AS unread_count
            FROM messaging_conversation c
            JOIN restaurant_restaurant r
                ON r.restaurant_id = c.restaurant_id
            JOIN account_account a
                ON a.account_id = c.account_id
            WHERE c.account_id = %s OR r.account_id = %s
            )
            SELECT * FROM threads t
            {search_filter}
            ORDER BY last_message_at DESC NULLS LAST, conversation_id DESC;
            """,
            [account_id] * 6 + search_params,
        )

        columns = [col[0] for col in cursor.description]
        conversations = [dict(zip(columns, row)) for row in cursor.fetchall()]

        unread_total = sum(c["unread_count"] for c in conversations)

        return {"conversations": conversations, "unread_total": unread_total}

    except Exception as error:
        print(f"Error: {error}")
        return {"error": str(error)}

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def getMessages(data):
    """One thread, and mark whatever the reader hasn't seen as read."""
    try:
        connection = connections['default']
        cursor = connection.cursor()

        conversation_id = data.get("conversation_id")
        account_id = data.get("account_id")

        if not conversation_id or not account_id:
            return {"error": "conversation_id and account_id are required"}

        cursor.execute(
            """
            SELECT c.conversation_id,
                   c.account_id AS diner_account_id,
                   c.restaurant_id,
                   r.account_id AS owner_account_id,
                   r.restaurant_name,
                   r.restaurant_logo_img,
                   COALESCE(
                       NULLIF(TRIM(CONCAT(a.first_name, ' ', a.last_name)), ''),
                       a.username
                   ) AS diner_name,
                   a.account_profile_photo AS diner_photo
            FROM messaging_conversation c
            JOIN restaurant_restaurant r
                ON r.restaurant_id = c.restaurant_id
            JOIN account_account a
                ON a.account_id = c.account_id
            WHERE c.conversation_id = %s;
            """,
            [conversation_id],
        )
        row = cursor.fetchone()

        if not row:
            return {"error": "Conversation not found"}

        columns = [col[0] for col in cursor.description]
        conversation = dict(zip(columns, row))

        if str(account_id) not in (
            str(conversation["diner_account_id"]),
            str(conversation["owner_account_id"]),
        ):
            return {"error": "This conversation is not yours"}

        is_diner = str(account_id) == str(conversation["diner_account_id"])

        conversation["my_role"] = "diner" if is_diner else "owner"
        conversation["counterpart_name"] = (
            conversation["restaurant_name"] if is_diner else conversation["diner_name"]
        )
        conversation["counterpart_photo"] = (
            conversation["restaurant_logo_img"] if is_diner else conversation["diner_photo"]
        )

        # Opening the thread is what marks the other side's messages as read.
        cursor.execute(
            """
            UPDATE messaging_message
            SET is_read = TRUE
            WHERE conversation_id = %s
              AND sender_id <> %s
              AND is_read = FALSE;
            """,
            [conversation_id, account_id],
        )
        connection.commit()

        cursor.execute(
            """
            SELECT m.*,
                   (m.sender_id = %s) AS is_mine,
                   a.username AS sender_username,
                   a.account_profile_photo AS sender_photo
            FROM messaging_message m
            JOIN account_account a
                ON a.account_id = m.sender_id
            WHERE m.conversation_id = %s
            ORDER BY m.sent_at, m.message_id;
            """,
            [account_id, conversation_id],
        )
        message_columns = [col[0] for col in cursor.description]
        messages = [dict(zip(message_columns, r)) for r in cursor.fetchall()]

        return {"conversation": conversation, "messages": messages}

    except Exception as error:
        print(f"Error: {error}")
        return {"error": str(error)}

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def startConversation(data):
    """The diner's way in: get or create the thread with one restaurant."""
    try:
        connection = connections['default']
        cursor = connection.cursor()

        account_id = data.get("account_id")
        restaurant_id = data.get("restaurant_id")

        if not account_id or not restaurant_id:
            return {"error": "account_id and restaurant_id are required"}

        cursor.execute(
            "SELECT account_id FROM restaurant_restaurant WHERE restaurant_id = %s;",
            [restaurant_id],
        )
        row = cursor.fetchone()

        if not row:
            return {"error": "Restaurant not found"}

        if str(row[0]) == str(account_id):
            return {"error": "You cannot message your own restaurant"}

        cursor.execute(
            """
            SELECT conversation_id
            FROM messaging_conversation
            WHERE account_id = %s AND restaurant_id = %s
            ORDER BY conversation_id
            LIMIT 1;
            """,
            [account_id, restaurant_id],
        )
        existing = cursor.fetchone()

        if existing:
            return {"conversation_id": existing[0], "created": False}

        cursor.execute(
            """
            INSERT INTO messaging_conversation
                (account_id, restaurant_id, status, created_at)
            VALUES (%s, %s, 'open', NOW())
            RETURNING conversation_id;
            """,
            [account_id, restaurant_id],
        )
        conversation_id = cursor.fetchone()[0]
        connection.commit()

        return {"conversation_id": conversation_id, "created": True}

    except IntegrityError as e:
        print(f"Error: {e}")
        return {"error": "Could not start the conversation"}

    except Exception as error:
        print(f"Error: {error}")
        return {"error": str(error)}

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def sendMessage(data):
    try:
        connection = connections['default']
        cursor = connection.cursor()

        account_id = data.get("account_id")
        conversation_id = data.get("conversation_id")
        restaurant_id = data.get("restaurant_id")
        message = (data.get("message") or "").strip()

        if not account_id:
            return {"error": "account_id is required"}

        if not message:
            return {"error": "Type a message first"}

        # A diner can send straight to a restaurant without opening the thread
        # first, so the conversation is created on demand. This repeats
        # startConversation rather than calling it, because every function here
        # closes the shared connection in its own `finally` - calling one from
        # another pulls the cursor out from under the caller.
        if not conversation_id:
            if not restaurant_id:
                return {"error": "conversation_id or restaurant_id is required"}

            cursor.execute(
                "SELECT account_id FROM restaurant_restaurant WHERE restaurant_id = %s;",
                [restaurant_id],
            )
            restaurant_row = cursor.fetchone()

            if not restaurant_row:
                return {"error": "Restaurant not found"}

            if str(restaurant_row[0]) == str(account_id):
                return {"error": "You cannot message your own restaurant"}

            cursor.execute(
                """
                SELECT conversation_id
                FROM messaging_conversation
                WHERE account_id = %s AND restaurant_id = %s
                ORDER BY conversation_id
                LIMIT 1;
                """,
                [account_id, restaurant_id],
            )
            existing = cursor.fetchone()

            if existing:
                conversation_id = existing[0]
            else:
                cursor.execute(
                    """
                    INSERT INTO messaging_conversation
                        (account_id, restaurant_id, status, created_at)
                    VALUES (%s, %s, 'open', NOW())
                    RETURNING conversation_id;
                    """,
                    [account_id, restaurant_id],
                )
                conversation_id = cursor.fetchone()[0]

        cursor.execute(
            """
            SELECT c.account_id AS diner_account_id,
                   c.restaurant_id,
                   r.account_id AS owner_account_id,
                   r.restaurant_name
            FROM messaging_conversation c
            JOIN restaurant_restaurant r
                ON r.restaurant_id = c.restaurant_id
            WHERE c.conversation_id = %s;
            """,
            [conversation_id],
        )
        row = cursor.fetchone()

        if not row:
            return {"error": "Conversation not found"}

        diner_account_id, conversation_restaurant_id, owner_account_id, restaurant_name = row

        if str(account_id) not in (str(diner_account_id), str(owner_account_id)):
            return {"error": "This conversation is not yours"}

        # The recipient is simply the other side.
        recipient_id = (
            owner_account_id
            if str(account_id) == str(diner_account_id)
            else diner_account_id
        )

        cursor.execute(
            """
            INSERT INTO messaging_message
                (conversation_id, sender_id, message, is_read, sent_at)
            VALUES (%s, %s, %s, FALSE, NOW())
            RETURNING message_id, sent_at;
            """,
            [conversation_id, account_id, message],
        )
        message_id, sent_at = cursor.fetchone()

        cursor.execute(
            """
            SELECT COALESCE(
                       NULLIF(TRIM(CONCAT(first_name, ' ', last_name)), ''),
                       username
                   )
            FROM account_account
            WHERE account_id = %s;
            """,
            [account_id],
        )
        sender_row = cursor.fetchone()
        sender_name = sender_row[0] if sender_row else "Someone"

        # A message the recipient hasn't opened yet also reaches them through
        # the notification feed, the same way reviews do. An unread thread
        # keeps one notification rather than stacking one per message.
        cursor.execute(
            """
            DELETE FROM notification_notification
            WHERE account_id = %s
              AND restaurant_id = %s
              AND is_read = FALSE
              AND title LIKE 'New message from %%';
            """,
            [recipient_id, conversation_restaurant_id],
        )
        cursor.execute(
            """
            INSERT INTO notification_notification
                (account_id, restaurant_id, title, body, is_read, created_at)
            VALUES (%s, %s, %s, %s, FALSE, NOW());
            """,
            (
                recipient_id,
                conversation_restaurant_id,
                f"New message from {sender_name}",
                message[:160],
            ),
        )

        connection.commit()

        return {
            "message": "Message sent",
            "message_id": message_id,
            "conversation_id": conversation_id,
            "sent_at": sent_at,
        }

    except IntegrityError as e:
        print(f"Error: {e}")
        return {"error": "Could not send the message"}

    except Exception as error:
        print(f"Error: {error}")
        return {"error": str(error)}

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def getUnreadMessageCount(data):
    """Badge number for the Messages tab."""
    try:
        connection = connections['default']
        cursor = connection.cursor()

        account_id = data.get("account_id")

        if not account_id:
            return {"error": "account_id is required"}

        cursor.execute(
            """
            SELECT COUNT(*)
            FROM messaging_message m
            JOIN messaging_conversation c
                ON c.conversation_id = m.conversation_id
            JOIN restaurant_restaurant r
                ON r.restaurant_id = c.restaurant_id
            WHERE m.is_read = FALSE
              AND m.sender_id <> %s
              AND (c.account_id = %s OR r.account_id = %s);
            """,
            [account_id, account_id, account_id],
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


def editMessage(data):
    """Rewrite a message. Only its sender may do so."""
    try:
        connection = connections['default']
        cursor = connection.cursor()

        account_id = data.get("account_id")
        message_id = data.get("message_id")
        message = (data.get("message") or "").strip()

        if not account_id or not message_id:
            return {"error": "account_id and message_id are required"}

        if not message:
            return {"error": "A message cannot be empty"}

        cursor.execute(
            """
            SELECT m.sender_id,
                   m.message,
                   m.conversation_id,
                   c.restaurant_id
            FROM messaging_message m
            JOIN messaging_conversation c
                ON c.conversation_id = m.conversation_id
            WHERE m.message_id = %s;
            """,
            [message_id],
        )
        row = cursor.fetchone()

        if not row:
            return {"error": "Message not found"}

        sender_id, current_text, conversation_id, restaurant_id = row

        # Being in the conversation isn't enough - you can only rewrite your
        # own words.
        if str(sender_id) != str(account_id):
            return {"error": "You can only edit your own messages"}

        if current_text == message:
            return {
                "message": "Message updated",
                "message_id": message_id,
                "conversation_id": conversation_id,
            }

        cursor.execute(
            """
            UPDATE messaging_message
            SET message = %s,
                edited_at = NOW()
            WHERE message_id = %s;
            """,
            [message, message_id],
        )

        # If the recipient hasn't opened the thread yet, the notification is
        # still showing the old wording, so refresh its preview. An already
        # read notification is left alone - it is a record of what arrived.
        cursor.execute(
            """
            UPDATE notification_notification
            SET body = %s
            WHERE account_id <> %s
              AND restaurant_id = %s
              AND is_read = FALSE
              AND title LIKE 'New message from %%'
              AND body = %s;
            """,
            [message[:160], account_id, restaurant_id, current_text[:160]],
        )

        connection.commit()

        return {
            "message": "Message updated",
            "message_id": message_id,
            "conversation_id": conversation_id,
        }

    except Exception as error:
        print(f"Error: {error}")
        return {"error": str(error)}

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def deleteMessage(data):
    """Remove a message from the thread. Only its sender may do so."""
    try:
        connection = connections['default']
        cursor = connection.cursor()

        account_id = data.get("account_id")
        message_id = data.get("message_id")

        if not account_id or not message_id:
            return {"error": "account_id and message_id are required"}

        cursor.execute(
            """
            SELECT m.sender_id,
                   m.message,
                   m.conversation_id,
                   c.restaurant_id
            FROM messaging_message m
            JOIN messaging_conversation c
                ON c.conversation_id = m.conversation_id
            WHERE m.message_id = %s;
            """,
            [message_id],
        )
        row = cursor.fetchone()

        if not row:
            return {"error": "Message not found"}

        sender_id, current_text, conversation_id, restaurant_id = row

        if str(sender_id) != str(account_id):
            return {"error": "You can only delete your own messages"}

        cursor.execute(
            "DELETE FROM messaging_message WHERE message_id = %s;",
            [message_id],
        )

        # Drop the unread notification this message raised - there is nothing
        # left for the recipient to open.
        cursor.execute(
            """
            DELETE FROM notification_notification
            WHERE account_id <> %s
              AND restaurant_id = %s
              AND is_read = FALSE
              AND title LIKE 'New message from %%'
              AND body = %s;
            """,
            [account_id, restaurant_id, current_text[:160]],
        )

        connection.commit()

        return {"message": "Message deleted", "conversation_id": conversation_id}

    except Exception as error:
        print(f"Error: {error}")
        return {"error": str(error)}

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()
