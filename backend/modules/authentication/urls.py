from django.urls import path
from .views import super_admin_login

urlpatterns = [
    path(
        'login/',
        super_admin_login
    ),
]