from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('apps.users.urls')),
    path('api/meetings/', include('apps.meetings.urls')),
    path('', include('apps.meetings.urls')),  # Matches root schedule-meeting endpoint
]
