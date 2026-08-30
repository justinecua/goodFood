from django.db import models
from restaurant.models import Restaurant
from dish.models import Dish


class Restaurant_Ranking(models.Model):
    res_ranking_id = models.AutoField(primary_key=True)
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)

    rank_position = models.PositiveIntegerField(null=True, blank=True)
    score = models.DecimalField(max_digits=6, decimal_places=3, default=0)
    review_count = models.PositiveIntegerField(default=0)
    computed_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.restaurant.restaurant_name} rank {self.rank_position}"


class Dish_Ranking(models.Model):
    dish_ranking_id = models.AutoField(primary_key=True)
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    dish = models.ForeignKey(Dish, on_delete=models.CASCADE)

    rank_position = models.PositiveIntegerField(null=True, blank=True)
    score = models.DecimalField(max_digits=6, decimal_places=3, default=0)
    review_count = models.PositiveIntegerField(default=0)
    computed_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.dish.dish_name} rank {self.rank_position}"
