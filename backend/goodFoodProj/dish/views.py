from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from rest_framework.parsers import MultiPartParser, FormParser

from .queries import (
    getDishCategories,
    addDishCategory,
    updateDishCategory,
    deleteDishCategory,
    getDishes,
    getDish,
    addDish,
    updateDish,
    deleteDish,
)


class GetDishCategories(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        return Response(getDishCategories(request.data))


class AddDishCategory(APIView):
    permission_classes = [permissions.AllowAny]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        return Response(addDishCategory(request.data))


class UpdateDishCategory(APIView):
    permission_classes = [permissions.AllowAny]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        return Response(updateDishCategory(request.data))


class DeleteDishCategory(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        return Response(deleteDishCategory(request.data))


class GetDishes(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        return Response(getDishes(request.data))


class GetDish(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        return Response(getDish(request.data))


class AddDish(APIView):
    permission_classes = [permissions.AllowAny]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        return Response(addDish(request.data))


class UpdateDish(APIView):
    permission_classes = [permissions.AllowAny]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        return Response(updateDish(request.data))


class DeleteDish(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        return Response(deleteDish(request.data))
