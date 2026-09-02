from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions

from .queries import (
    getRestaurantReviews,
    addRestaurantReview,
    deleteRestaurantReview,
    getDishReviews,
    addDishReview,
    deleteDishReview,
    getMyReviews,
    getOwnerReviews,
)


class GetRestaurantReviews(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        return Response(getRestaurantReviews(request.data))


class AddRestaurantReview(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        return Response(addRestaurantReview(request.data))


class DeleteRestaurantReview(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        return Response(deleteRestaurantReview(request.data))


class GetDishReviews(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        return Response(getDishReviews(request.data))


class AddDishReview(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        return Response(addDishReview(request.data))


class DeleteDishReview(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        return Response(deleteDishReview(request.data))


class GetMyReviews(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        return Response(getMyReviews(request.data))


class GetOwnerReviews(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        return Response(getOwnerReviews(request.data))
