from django.contrib import admin
from django.urls import path, include
from apps.meetings.views import (
    company_login_view,
    company_signup_view,
    company_api_key_get_view,
    company_api_key_generate_view,
    schedule_meeting_view,
    super_admin_dashboard_view,
    company_register_view,
    verify_key_view
)

urlpatterns = [
    path('company/signup/', company_signup_view, name='company_signup'),
    path('company/signup', company_signup_view),
    path('company/login/', company_login_view, name='company_login'),
    
    # Company Registration Portal
    path('company/register/', company_register_view, name='company_register'),
    path('company/register', company_register_view),
    
    # Super Admin Dashboard
    path('super-admin/dashboard/', super_admin_dashboard_view, name='super_admin_dashboard'),
    path('super-admin/dashboard', super_admin_dashboard_view),
    
    # API key verification for external backends
    path('api/verify-key/', verify_key_view, name='verify_key'),
    path('api/verify-key', verify_key_view),
    
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
    path('', include('apps.meetings.urls')),
]
