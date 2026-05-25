from django.urls import path
from .views import CreateMeetingView, JoinMeetingView


urlpatterns = [
    path('create/', CreateMeetingView.as_view()),

    path(
        'join/<uuid:meeting_id>/',
        JoinMeetingView.as_view()
    ),
]