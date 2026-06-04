from django.urls import path
from . import views

urlpatterns = [
    # Live meeting actions (HEAD)
    path("toggle-mic/", views.toggle_mic),
    path("start-recording/", views.start_recording),
    path("stop-recording/", views.stop_recording),
    path("start-screen-share/", views.start_screen_share),
    path("stop-screen-share/", views.stop_screen_share),
    path("current-screen-sharer/<str:meeting_link>/", views.current_screen_sharer),

    # Scheduling actions (Team-B)
    path("create/", views.create_meeting),
    path("schedule-meeting/", views.schedule_meeting),
]