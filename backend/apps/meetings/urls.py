from django.urls import path
from .views import create_meeting

urlpatterns = [
    path("create/", create_meeting),
]