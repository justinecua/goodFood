from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions

from .queries import (
    getTopRestaurants,
    getTopDishes,
    getNearbyRestaurants,
    getRecentReviews,
)


class GetTopRestaurants(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        return Response(getTopRestaurants(request.data))


class GetTopDishes(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        return Response(getTopDishes(request.data))


class GetNearbyRestaurants(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        return Response(getNearbyRestaurants(request.data))


class GetRecentReviews(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        return Response(getRecentReviews(request.data))
