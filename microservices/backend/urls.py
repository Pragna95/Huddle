from django.contrib import admin
from django.urls import path, include
from apps.meetings.views import (
    company_login_view,
    company_api_key_get_view,
    company_api_key_generate_view,
    schedule_meeting_view
)

urlpatterns = [
    path('company/login/', company_login_view, name='company_login'),
    
    # API key retrieval and generation (supporting with/without trailing slash)
    path('company/api-key', company_api_key_get_view, name='company_api_key'),
    path('company/api-key/', company_api_key_get_view),
    path('company/api-key/generate', company_api_key_generate_view, name='company_api_key_generate'),
    path('company/api-key/generate/', company_api_key_generate_view),
    
    # Schedule meeting endpoint (supporting with/without trailing slash)
    path('api/schedule-meeting', schedule_meeting_view, name='schedule_meeting'),
    path('api/schedule-meeting/', schedule_meeting_view),
    
    path('admin/', admin.site.urls),
    path('api/meetings/', include('apps.meetings.urls')),
]
