from django.urls import path
# pyrefly: ignore [missing-import]
from . import views   

urlpatterns = [
    path("create/", views.create_meeting),
    path("schedule-meeting/", views.schedule_meeting),
]