from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions

from .queries import (
    getConversations,
    getMessages,
    startConversation,
    sendMessage,
    editMessage,
    deleteMessage,
    getUnreadMessageCount,
)


class GetConversations(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        return Response(getConversations(request.data))


class GetMessages(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        return Response(getMessages(request.data))


class StartConversation(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        return Response(startConversation(request.data))


class SendMessage(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        return Response(sendMessage(request.data))


class EditMessage(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        return Response(editMessage(request.data))


class DeleteMessage(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        return Response(deleteMessage(request.data))


class GetUnreadMessageCount(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        return Response(getUnreadMessageCount(request.data))
