from django.urls import path

from .views import (
    toggle_mic,
    start_recording,
    stop_recording,
    start_screen_share,
    stop_screen_share,
    current_screen_sharer,
)

urlpatterns = [
    path("toggle-mic/", toggle_mic),
    path("start-recording/", start_recording),
    path("stop-recording/", stop_recording),
    path("start-screen-share/", start_screen_share),
    path("stop-screen-share/", stop_screen_share),
    path("current-screen-sharer/<str:meeting_link>/", current_screen_sharer),
]