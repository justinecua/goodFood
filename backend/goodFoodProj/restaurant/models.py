from django.db import models
from account.models import Account
from location.models import Location


class Restaurant(models.Model):
    restaurant_id = models.BigAutoField(primary_key=True)
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    location = models.ForeignKey(
        Location, on_delete=models.SET_NULL, null=True, blank=True
    )

    restaurant_name = models.CharField(max_length=500)
    restaurant_description = models.TextField(blank=True, null=True)
    address = models.CharField(max_length=255)
    contact_number = models.CharField(max_length=20)
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    restaurant_logo_img = models.ImageField(
        upload_to='restaurant_logo_photos/', blank=True, null=True
    )
    restaurant_cover_img = models.ImageField(
        upload_to='restaurant_cover_photos/', blank=True, null=True
    )

    def __str__(self):
        return f"{self.restaurant_name}"


class Restaurant_Branch(models.Model):
    branch_id = models.AutoField(primary_key=True)
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)

    branch_name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    contact_number = models.CharField(max_length=20)
    latitude = models.CharField(max_length=255, blank=True, null=True)
    longitude = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.restaurant.restaurant_name} - {self.branch_name}"


class Operating_Hours(models.Model):
    operating_hours_id = models.AutoField(primary_key=True)
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)

    day_of_week = models.CharField(max_length=20)
    opening_time = models.TimeField(blank=True, null=True)
    closing_time = models.TimeField(blank=True, null=True)
    is_closed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.restaurant.restaurant_name} - {self.day_of_week}"


class Category(models.Model):
    category_id = models.AutoField(primary_key=True)
    category_name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return f"{self.category_name}"


class Restaurant_Category(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)

    class Meta:
        unique_together = ("restaurant", "category")

    def __str__(self):
        return f"{self.restaurant.restaurant_name} - {self.category.category_name}"
