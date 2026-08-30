from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from rest_framework.parsers import MultiPartParser, FormParser

from .queries import getRestaurantInfo, addRestaurantInfo


class GetRestaurantInfo(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        return Response(getRestaurantInfo(request.data))


class AddRestaurantInfo(APIView):
    permission_classes = [permissions.AllowAny]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        return Response(addRestaurantInfo(request.data))
