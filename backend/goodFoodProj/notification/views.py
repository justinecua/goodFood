from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions

from .queries import (
    getNotifications,
    getUnreadCount,
    addNotification,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
)


class GetNotifications(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        return Response(getNotifications(request.data))


class GetUnreadCount(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        return Response(getUnreadCount(request.data))


class AddNotification(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        return Response(addNotification(request.data))


class MarkNotificationRead(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        return Response(markNotificationRead(request.data))


class MarkAllNotificationsRead(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        return Response(markAllNotificationsRead(request.data))


class DeleteNotification(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        return Response(deleteNotification(request.data))
