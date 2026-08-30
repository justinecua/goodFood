from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from rest_framework.parsers import MultiPartParser, FormParser

from .queries import getDishCategories, addDishCategory, getDishes, addDish


class GetDishCategories(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        return Response(getDishCategories(request.data))


class AddDishCategory(APIView):
    permission_classes = [permissions.AllowAny]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        return Response(addDishCategory(request.data))


class GetDishes(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        return Response(getDishes(request.data))


class AddDish(APIView):
    permission_classes = [permissions.AllowAny]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        return Response(addDish(request.data))
