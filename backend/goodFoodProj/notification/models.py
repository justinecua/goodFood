from django.db import models
from account.models import Account
from restaurant.models import Restaurant


class Notification(models.Model):
    notification_id = models.AutoField(primary_key=True)
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    restaurant = models.ForeignKey(
        Restaurant, on_delete=models.CASCADE, null=True, blank=True
    )

    title = models.CharField(max_length=255)
    body = models.TextField(blank=True, null=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} -> {self.account.username}"
