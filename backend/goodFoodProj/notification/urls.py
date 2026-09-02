from django.urls import path
from .views import (
    GetNotifications,
    GetUnreadCount,
    AddNotification,
    MarkNotificationRead,
    MarkAllNotificationsRead,
    DeleteNotification,
)

urlpatterns = [
    path("get-notifications/", GetNotifications.as_view(), name="get-notifications"),
    path("get-unread-count/", GetUnreadCount.as_view(), name="get-unread-count"),
    path("add-notification/", AddNotification.as_view(), name="add-notification"),
    path("mark-notification-read/", MarkNotificationRead.as_view(), name="mark-notification-read"),
    path("mark-all-notifications-read/", MarkAllNotificationsRead.as_view(), name="mark-all-notifications-read"),
    path("delete-notification/", DeleteNotification.as_view(), name="delete-notification"),
]
