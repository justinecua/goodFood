from django.urls import path
from .views import (
    GetRestaurantReviews,
    AddRestaurantReview,
    DeleteRestaurantReview,
    GetDishReviews,
    AddDishReview,
    DeleteDishReview,
    GetMyReviews,
    GetOwnerReviews,
)

urlpatterns = [
    path("get-restaurant-reviews/", GetRestaurantReviews.as_view(), name="get-restaurant-reviews"),
    path("add-restaurant-review/", AddRestaurantReview.as_view(), name="add-restaurant-review"),
    path("delete-restaurant-review/", DeleteRestaurantReview.as_view(), name="delete-restaurant-review"),
    path("get-dish-reviews/", GetDishReviews.as_view(), name="get-dish-reviews"),
    path("add-dish-review/", AddDishReview.as_view(), name="add-dish-review"),
    path("delete-dish-review/", DeleteDishReview.as_view(), name="delete-dish-review"),
    path("get-my-reviews/", GetMyReviews.as_view(), name="get-my-reviews"),
    path("get-owner-reviews/", GetOwnerReviews.as_view(), name="get-owner-reviews"),
]
