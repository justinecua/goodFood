from django.urls import path
from .views import GetRestaurantInfo, AddRestaurantInfo

urlpatterns = [
    path("get-restaurant-info/", GetRestaurantInfo.as_view(), name="get-restaurant-info"),
    path("add-restaurant-info/", AddRestaurantInfo.as_view(), name="add-restaurant-info"),
]
