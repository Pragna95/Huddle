from django.urls import path
from .views import create_room

urlpatterns = [
    path('create-room/', create_room),
]