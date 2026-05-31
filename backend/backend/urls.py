from django.urls import path, include
from django.contrib import admin  

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('apps.meetings.urls')),   # include your app urls
]