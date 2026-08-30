from django.db import models
from account.models import Account
from restaurant.models import Restaurant
from dish.models import Dish


class Restaurant_Review(models.Model):
    res_review_id = models.AutoField(primary_key=True)
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    account = models.ForeignKey(Account, on_delete=models.CASCADE)

    food_rating = models.DecimalField(max_digits=3, decimal_places=2)
    service_rating = models.DecimalField(max_digits=3, decimal_places=2)
    ambiance_rating = models.DecimalField(max_digits=3, decimal_places=2)
    overall_rating = models.DecimalField(max_digits=3, decimal_places=2)
    comment = models.TextField(blank=True, null=True)
    is_flagged = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.restaurant.restaurant_name} review by {self.account.username}"


class Dish_Review(models.Model):
    dish_review_id = models.AutoField(primary_key=True)
    dish = models.ForeignKey(Dish, on_delete=models.CASCADE)
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    account = models.ForeignKey(Account, on_delete=models.CASCADE)

    rating = models.DecimalField(max_digits=3, decimal_places=2)
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.dish.dish_name} review by {self.account.username}"
