from django.urls import path
from .views import GetDishCategories, AddDishCategory, GetDishes, AddDish

urlpatterns = [
    path("get-dish-categories/", GetDishCategories.as_view(), name="get-dish-categories"),
    path("add-dish-category/", AddDishCategory.as_view(), name="add-dish-category"),
    path("get-dishes/", GetDishes.as_view(), name="get-dishes"),
    path("add-dish/", AddDish.as_view(), name="add-dish"),
]
