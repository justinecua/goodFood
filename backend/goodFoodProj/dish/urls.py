from django.urls import path
from .views import (
    GetDishCategories,
    AddDishCategory,
    UpdateDishCategory,
    DeleteDishCategory,
    GetDishes,
    GetDish,
    AddDish,
    UpdateDish,
    DeleteDish,
)

urlpatterns = [
    path("get-dish-categories/", GetDishCategories.as_view(), name="get-dish-categories"),
    path("add-dish-category/", AddDishCategory.as_view(), name="add-dish-category"),
    path("update-dish-category/", UpdateDishCategory.as_view(), name="update-dish-category"),
    path("delete-dish-category/", DeleteDishCategory.as_view(), name="delete-dish-category"),
    path("get-dishes/", GetDishes.as_view(), name="get-dishes"),
    path("get-dish/", GetDish.as_view(), name="get-dish"),
    path("add-dish/", AddDish.as_view(), name="add-dish"),
    path("update-dish/", UpdateDish.as_view(), name="update-dish"),
    path("delete-dish/", DeleteDish.as_view(), name="delete-dish"),
]
