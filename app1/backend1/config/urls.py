from django.contrib import admin
from django.urls import path, include
from authentication.meetings_views import ScheduleMeetingProxyView, ListMeetingsProxyView, ValidateMeetingProxyView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('authentication.urls')),
    
    # Meeting Scheduling Proxy endpoints
    path('api/schedule-meeting', ScheduleMeetingProxyView.as_view(), name='schedule_meeting_proxy'),
    path('api/schedule-meeting/', ScheduleMeetingProxyView.as_view()),
    
    # Meetings List Proxy endpoints
    path('api/meetings', ListMeetingsProxyView.as_view(), name='list_meetings_proxy'),
    path('api/meetings/', ListMeetingsProxyView.as_view()),
    
    # Lobby Validation Proxy endpoints
    path('api/meeting/validate/<str:company>/<str:letter>/<str:api_key>/<str:meeting_id>', ValidateMeetingProxyView.as_view(), name='validate_meeting_proxy'),
    path('api/meeting/validate/<str:company>/<str:letter>/<str:api_key>/<str:meeting_id>/', ValidateMeetingProxyView.as_view()),
]
