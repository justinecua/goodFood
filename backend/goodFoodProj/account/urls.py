
from django.urls import path
from .views import (
    GetAccountType,
    RegisterAccount,
    LoginAccount,
    LogoutAccount,
    CheckInfoComplete,
    AddAdditionalInfo,
    UpdateProfilePhoto,
    ChangePassword,
)

urlpatterns = [
    path("account-types/", GetAccountType.as_view(), name="account-types"),
    path("register/", RegisterAccount.as_view(), name="register"),
    path("login/", LoginAccount.as_view(), name="login"),
    path("check-info-complete/", CheckInfoComplete.as_view(),  name="check-info-complete"),
    path("add-additional-info/", AddAdditionalInfo.as_view(),  name="add-additional-info"),
    path("update-profile-photo/", UpdateProfilePhoto.as_view(), name="update-profile-photo"),
    path("change-password/", ChangePassword.as_view(), name="change-password"),
    path('logout/', LogoutAccount.as_view()),
]