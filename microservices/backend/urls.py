from django.contrib import admin
from django.urls import path, include
from apps.meetings.views import company_login_view

urlpatterns = [
    path('company/login/', company_login_view, name='company_login'),
    path('admin/', admin.site.urls),
    path('api/meetings/', include('apps.meetings.urls')),
]
