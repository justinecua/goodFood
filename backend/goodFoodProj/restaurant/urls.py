from django.urls import path
from .views import (
    GetRestaurantInfo,
    GetRestaurantDetails,
    AddRestaurantInfo,
    AddBranch,
    UpdateBranch,
    DeleteBranch,
)

urlpatterns = [
    path("get-restaurant-info/", GetRestaurantInfo.as_view(), name="get-restaurant-info"),
    path("get-restaurant-details/", GetRestaurantDetails.as_view(), name="get-restaurant-details"),
    path("add-restaurant-info/", AddRestaurantInfo.as_view(), name="add-restaurant-info"),
    path("add-branch/", AddBranch.as_view(), name="add-branch"),
    path("update-branch/", UpdateBranch.as_view(), name="update-branch"),
    path("delete-branch/", DeleteBranch.as_view(), name="delete-branch"),
]
