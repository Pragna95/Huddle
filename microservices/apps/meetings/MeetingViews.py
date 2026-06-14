import random
import string

from django.contrib.auth.hashers import check_password
from django.core.signing import Signer
from django.core.mail import send_mail
from django.conf import settings
from django.utils.dateparse import parse_datetime

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny

from .models import (
    ProductApiKey,
    Product,
    User,
    Meeting,
    MeetingParticipant
)


def generate_meeting_code():
    while True:
        segments = [
            ''.join(random.choices(string.ascii_lowercase, k=3)),
            ''.join(random.choices(string.ascii_lowercase, k=4)),
            ''.join(random.choices(string.ascii_lowercase, k=3))
        ]
        code = '-'.join(segments)

        if not Meeting.objects.filter(meeting_code=code).exists():
            return code


class ValidateMeetingView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, company=None, api_key=None, meeting_id=None):
        try:
            meeting = Meeting.objects.get(id=meeting_id)

            return Response({
                "title": meeting.title,
                "datetime": str(meeting.scheduled_start),
                "company_name": company if company else "Unknown",
                "participants": [],
                "meeting_code": meeting.meeting_code,
            }, status=status.HTTP_200_OK)

        except Meeting.DoesNotExist:
            return Response(
                {"error": "Meeting not found"},
                status=status.HTTP_404_NOT_FOUND
            )


class ScheduleMeetingView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):

        # Get API Key from Header
        raw_api_key = request.headers.get("X-Api-Key")

        if not raw_api_key:
            return Response(
                {"error": "X-Api-Key header is required"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Validate API Key
        # valid_api_key_obj = None

        # for api_key_obj in ProductApiKey.objects.filter(is_active=True):
        #     if check_password(raw_api_key, api_key_obj.api_key_hash):
        #         valid_api_key_obj = api_key_obj
        #         break

        # if not valid_api_key_obj:
        #     return Response(
        #         {"error": "Invalid API Key"},
        #         status=status.HTTP_401_UNAUTHORIZED
        #     )
        # TEMPORARY DEV BYPASS
        valid_api_key_obj = ProductApiKey.objects.filter(is_active=True).first()
        if not valid_api_key_obj:
            return Response(
        {"error": "No active API key found"},
        status=status.HTTP_401_UNAUTHORIZED
    )
        product = valid_api_key_obj.product

        # Request Data
        email = request.data.get("email")
        name = request.data.get("name", "Unknown User")
        title = request.data.get("title")
        description = request.data.get("description", "")
        datetime_str = request.data.get("datetime")
        participant_emails = request.data.get("participant_emails", [])

        if not email or not title or not datetime_str:
            return Response(
                {"error": "email, title and datetime are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Parse datetime
        scheduled_dt = parse_datetime(datetime_str)

        if not scheduled_dt:
            return Response(
                {"error": "Invalid datetime format"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get or Create Host User
        user, created = User.objects.get_or_create(
            product=product,
            email=email,
            defaults={
                "name": name,
                "external_user_id": email,
                "role": "host"
            }
        )

        # Generate Meeting Code
        meeting_code = generate_meeting_code()

        # Create Meeting
        meeting = Meeting.objects.create(
    product=product,
    created_by_user=user,
    title=title,
    description=description,
    meeting_code=meeting_code,
    status="scheduled",
    scheduled_start=scheduled_dt,
    timezone="Asia/Kolkata"
)  

        # Create Participants
        for participant_email in participant_emails:

            participant_user, _ = User.objects.get_or_create(
                product=product,
                email=participant_email,
                defaults={
                    "name": participant_email.split("@")[0],
                    "external_user_id": participant_email,
                    "role": "participant"
                }
            )

            MeetingParticipant.objects.create(
                meeting=meeting,
                user=participant_user,
                role="participant",
                invited_by=user,
                invitation_status="pending"
            )

        # Encrypt API Key
        signer = Signer()
        encrypted_api_key = signer.sign(raw_api_key)

        # Meeting Link
        meeting_link = (
            f"{settings.FRONTEND_URL}/"
            f"{meeting.meeting_code}/"
            f"{encrypted_api_key}/"
            f"{meeting.id}"
        )

        # Send Email Invitations
        if participant_emails:
            send_mail(
                subject=f"Meeting Invitation: {title}",
                message=f"""
You have been invited to a meeting.

Title: {title}

Description:
{description}

Date & Time:
{scheduled_dt}

Meeting Link:
{meeting_link}
""",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=participant_emails,
                fail_silently=False,
            )

        return Response(
            {
                "message": "Meeting scheduled successfully",
                "meeting_id": str(meeting.id),
                "meeting_code": meeting.meeting_code,
                "meeting_link": meeting_link,
                "encrypted_api_key": encrypted_api_key,
            },
            status=status.HTTP_201_CREATED,
        )