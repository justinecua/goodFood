from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from rest_framework.parsers import MultiPartParser, FormParser
from .queries import (
    getAccountType,
    registerAccount,
    login,
    logout,
    checkInfoIfComplete,
    addAdditionalInfo
)

def print_test(request):
    print("connected successfully")
    return JsonResponse({"message": "connected successfully"})

class GetAccountType(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        data = getAccountType() 
        return Response(data)

class RegisterAccount(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        data = registerAccount(request.data)
        return Response(data)

class LoginAccount(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        data = login(request.data)
        return Response(data)

class LogoutAccount(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        data = logout(request.data)
        return Response(data)

class CheckInfoComplete(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        result = checkInfoIfComplete(request.data)
        return Response(result)

class AddAdditionalInfo(APIView):
    permission_classes = [permissions.AllowAny]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        result = addAdditionalInfo(request.data)
        return Response(result)