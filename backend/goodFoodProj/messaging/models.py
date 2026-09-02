from django.db import models
from account.models import Account
from restaurant.models import Restaurant


class Conversation(models.Model):
    conversation_id = models.AutoField(primary_key=True)
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)

    status = models.CharField(max_length=50, default='open')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return (
            f"{self.account.username} <-> {self.restaurant.restaurant_name}"
        )


class Message(models.Model):
    message_id = models.AutoField(primary_key=True)
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE)
    # Which side of the conversation wrote this. A conversation only ever has
    # two participants - the diner (Conversation.account) and the restaurant's
    # owner (Conversation.restaurant.account) - so the sender is enough to
    # place a message on the left or the right of the thread, and to work out
    # who the other party is when a notification needs sending.
    sender = models.ForeignKey(Account, on_delete=models.CASCADE)

    message = models.TextField()
    # Read by the recipient, i.e. by whoever is not the sender.
    is_read = models.BooleanField(default=False)
    sent_at = models.DateTimeField(auto_now_add=True)
    # Set the first time the sender rewrites the message, so the thread can
    # mark it as edited. Null means it still says what was originally sent.
    edited_at = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f"Message {self.message_id} in conversation {self.conversation_id}"
