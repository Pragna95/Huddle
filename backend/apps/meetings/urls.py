from django.urls import path
from . import views

urlpatterns = [
    path("toggle-mic/", views.toggle_mic),
    path("start-recording/", views.start_recording),
    path("stop-recording/", views.stop_recording),
    path("start-screen-share/", views.start_screen_share),
    path("stop-screen-share/", views.stop_screen_share),
    path("current-screen-sharer/<str:meeting_link>/", views.current_screen_sharer),
    path("participant/<str:meeting_id>/<int:user_id>/", views.get_participant),
    path("participant/update/", views.update_participant),
    path("participants/<str:meeting_id>/", views.get_all_participants),
]