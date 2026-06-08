from django.urls import path
from . import views

urlpatterns = [
    path('', views.meetings_view, name='meetings_api'),
    path('participant/<str:meeting_id>/<str:user_id>/', views.participant_get_view, name='participant_get'),
    path('participant/update/', views.participant_update_view, name='participant_update'),
    
    # Hybrid Authentication & Template routes
    path('login/', views.meetings_login_view, name='meetings_login'),
    path('logout/', views.meetings_logout_view, name='meetings_logout'),
    path('signup/', views.meetings_signup_view, name='meetings_signup'),
    path('join/<uuid:token>/', views.join_meeting_view, name='join_meeting'),
    path('create-meeting/', views.create_meeting_view, name='create_meeting'),
    path('dashboard/', views.host_dashboard_view, name='host_dashboard'),
    
    # Validation route for System 1 React lobby
    path('api/meeting/validate/<str:company>/<str:letter>/<str:api_key>/<str:meeting_id>', views.validate_meeting_view, name='validate_meeting'),
    path('api/meeting/validate/<str:company>/<str:letter>/<str:api_key>/<str:meeting_id>/', views.validate_meeting_view),
    path('api/meeting/validate-lobby/<str:meeting_id>', views.validate_meeting_lobby_view, name='validate_meeting_lobby'),
    path('api/meeting/validate-lobby/<str:meeting_id>/', views.validate_meeting_lobby_view),
]