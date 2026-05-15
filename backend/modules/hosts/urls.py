from django.urls import path

from modules.hosts.views import create_host


urlpatterns = [
    path('create/', create_host),
]