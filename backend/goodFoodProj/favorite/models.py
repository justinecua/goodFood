from django.db import models
from account.models import Account
from restaurant.models import Restaurant
from dish.models import Dish


class Favorite(models.Model):
    favorite_id = models.AutoField(primary_key=True)
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    restaurant = models.ForeignKey(
        Restaurant, on_delete=models.CASCADE, null=True, blank=True
    )
    dish = models.ForeignKey(
        Dish, on_delete=models.CASCADE, null=True, blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        target = self.dish or self.restaurant
        return f"{self.account.username} favorited {target}"
