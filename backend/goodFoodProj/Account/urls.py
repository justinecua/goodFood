
from django.urls import path
from .views import (GetAccountType, RegisterAccount, LoginAccount, LogoutAccount)

urlpatterns = [
    path("account-types/", GetAccountType.as_view(), name="account-types"),
    path("register/", RegisterAccount.as_view(), name="register"),
    path("login/", LoginAccount.as_view(), name="login"),
    path('logout/', LogoutAccount.as_view()),
]