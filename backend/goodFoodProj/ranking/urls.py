from django.urls import path
from .views import (
    GetTopRestaurants,
    GetTopDishes,
    GetNearbyRestaurants,
    GetRecentReviews,
)

urlpatterns = [
    path("get-top-restaurants/", GetTopRestaurants.as_view(), name="get-top-restaurants"),
    path("get-top-dishes/", GetTopDishes.as_view(), name="get-top-dishes"),
    path("get-nearby-restaurants/", GetNearbyRestaurants.as_view(), name="get-nearby-restaurants"),
    path("get-recent-reviews/", GetRecentReviews.as_view(), name="get-recent-reviews"),
]
