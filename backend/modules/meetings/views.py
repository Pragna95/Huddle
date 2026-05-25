from .models import Meeting
from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializers import MeetingSerializer
from .services import create_meeting

from modules.authentication.authentication import ApiKeyAuthentication
from modules.authentication.permissions import IsHost


class CreateMeetingView(APIView):

    authentication_classes = [ApiKeyAuthentication]
    permission_classes = [IsHost]

    def post(self, request):

        serializer = MeetingSerializer(data=request.data)

        if serializer.is_valid():

            meeting = create_meeting(
                host=request.user,
                validated_data=serializer.validated_data
            )

            return Response({
                "message": "Meeting created successfully",
                "meeting_id": str(meeting.meeting_id),
                "join_link": meeting.join_link
            })

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
    from .models import Meeting

class JoinMeetingView(APIView):

    authentication_classes = [ApiKeyAuthentication]

    def get(self, request, meeting_id):

        try:
            meeting = Meeting.objects.get(
                meeting_id=meeting_id,
                is_active=True
            )

            return Response({
                "meeting_id": str(meeting.meeting_id),
                "title": meeting.title,
                "description": meeting.description,
                "join_link": meeting.join_link,
                "host": meeting.host.username
            })

        except Meeting.DoesNotExist:

            return Response({
                "error": "Meeting not found"
            }, status=404)