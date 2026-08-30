from django.db import models
from restaurant.models import Restaurant


class Dish_Category(models.Model):
    dish_category_id = models.AutoField(primary_key=True)
    dish_category_name = models.CharField(max_length=255)
    dish_category_description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.dish_category_name}"


class Dish(models.Model):
    dish_id = models.AutoField(primary_key=True)
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    dish_category = models.ForeignKey(
        Dish_Category, on_delete=models.SET_NULL, null=True, blank=True
    )

    dish_name = models.CharField(max_length=255)
    dish_description = models.TextField(blank=True, null=True)
    dish_price = models.DecimalField(max_digits=10, decimal_places=2)
    is_signature = models.BooleanField(default=False)
    is_best_seller = models.BooleanField(default=False)
    is_available = models.BooleanField(default=True)
    preparation_notes = models.TextField(blank=True, null=True)
    how_to_eat = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.dish_name}"


class Dish_Images(models.Model):
    dish_image_id = models.AutoField(primary_key=True)
    dish = models.ForeignKey(Dish, on_delete=models.CASCADE)

    dish_image_path = models.ImageField(upload_to='dish_photos/')
    caption = models.CharField(max_length=255, blank=True, null=True)
    is_primary = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.dish.dish_name} image"
