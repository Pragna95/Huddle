from django.urls import path
from .views import toggle_mic
from .views import toggle_mic, start_recording,stop_recording

urlpatterns = [
    path("toggle-mic/", toggle_mic),
    path("start-recording/", start_recording),
    path("stop-recording/", stop_recording),
]