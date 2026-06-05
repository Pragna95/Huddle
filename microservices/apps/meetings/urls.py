from django.urls import path
from . import views

urlpatterns = [
    path('', views.meetings_view, name='meetings_api'),
    path('participant/<str:meeting_id>/<str:user_id>/', views.participant_get_view, name='participant_get'),
    path('participant/update/', views.participant_update_view, name='participant_update'),
]