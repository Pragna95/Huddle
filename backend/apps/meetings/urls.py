from django.urls import path

#create_meeting → creates meeting
#join_meeting → verifies and joins meeting
from .views import (
    create_meeting,
    join_meeting
)

urlpatterns = [

   
    # CREATE MEETING API
   
    path(
        'create-meeting/',
        create_meeting,
        name='create_meeting'
    ),

    
    # JOIN MEETING URL
    
    path(
        'meet/<str:meeting_code>/',
        join_meeting,
        name='join_meeting'
    ),
]