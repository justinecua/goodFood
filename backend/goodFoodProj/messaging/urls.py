from django.urls import path
from .views import (
    GetConversations,
    GetMessages,
    StartConversation,
    SendMessage,
    EditMessage,
    DeleteMessage,
    GetUnreadMessageCount,
)

urlpatterns = [
    path("get-conversations/", GetConversations.as_view(), name="get-conversations"),
    path("get-messages/", GetMessages.as_view(), name="get-messages"),
    path("start-conversation/", StartConversation.as_view(), name="start-conversation"),
    path("send-message/", SendMessage.as_view(), name="send-message"),
    path("edit-message/", EditMessage.as_view(), name="edit-message"),
    path("delete-message/", DeleteMessage.as_view(), name="delete-message"),
    path("get-unread-message-count/", GetUnreadMessageCount.as_view(), name="get-unread-message-count"),
]
