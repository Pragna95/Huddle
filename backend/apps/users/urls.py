from django.urls import path
from .views import super_admin_login, create_host

urlpatterns = [
    path('login/', super_admin_login),
    path('create/', create_host),
]