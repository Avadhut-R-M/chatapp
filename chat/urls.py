from django.urls import include, path
from rest_framework.routers import SimpleRouter

from . import views

router = SimpleRouter()
router.register("group", views.GroupViewSet, basename="group")
router.register("message", views.MessageViewSet, basename="message")
router.register("user", views.UserViewSet, basename="user")

urlpatterns = [path("", include(router.urls))]
