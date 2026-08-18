
from django.urls import path
from .views import (
    GetAccountType,
    RegisterAccount,
    LoginAccount,
    LogoutAccount,
    CheckInfoComplete,
    AddAdditionalInfo
)

urlpatterns = [
    path("account-types/", GetAccountType.as_view(), name="account-types"),
    path("register/", RegisterAccount.as_view(), name="register"),
    path("login/", LoginAccount.as_view(), name="login"),
    path("check-info-complete/", CheckInfoComplete.as_view(),  name="check-info-complete"),
    path("add-additional-info/", AddAdditionalInfo.as_view(),  name="add-additional-info"),
    path('logout/', LogoutAccount.as_view()),
]