from django.views import generic
from rest_framework.schemas import get_schema_view
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.urls import path
from .views import LogoutView

urlpatterns = [
    path("auth/token", TokenObtainPairView.as_view()),
    path("auth/refresh_token", TokenRefreshView.as_view()),
    path("auth/logout/", LogoutView.as_view())
]