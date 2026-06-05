import secrets
from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from .models import Host, ApiKey, Meeting, Participant

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
@authentication_classes([])
def company_login_view(request):
    if request.method == 'GET':
        return render(request, 'company/login.html')

    # POST: Authenticate Host
    email = request.data.get('email')
    password = request.data.get('password')

    host = Host.objects.filter(email=email, is_active=True).first()
    if not host or not host.check_password(password):
        return Response({"message": "Invalid email or password."}, status=400)

    # Fetch or generate API Key
    api_key_obj = ApiKey.objects.filter(host=host, is_active=True).first()
    if not api_key_obj:
        key_str = f"app1_sk_{secrets.token_hex(16)}"
        api_key_obj = ApiKey.objects.create(
            key=key_str,
            app_name="app1",
            host=host,
            is_active=True
        )

    return Response({
        "api_key": api_key_obj.key,
        "company": host.company_name,
        "expires": None
    })


@api_view(['GET', 'POST'])
def meetings_view(request):
    if request.method == 'POST':
        title = request.data.get('title')
        participants_emails = request.data.get('participants', [])

        if not title:
            return Response({"error": "Title is required."}, status=400)

        meeting = Meeting.objects.create(
            title=title,
            host=request.user
        )

        for email in participants_emails:
            Participant.objects.create(
                meeting=meeting,
                user_email=email,
                user_id=""
            )

        return Response({
            "id": str(meeting.id),
            "title": meeting.title,
            "host": meeting.host.email,
            "created_at": meeting.created_at,
            "participants": participants_emails
        }, status=201)

    elif request.method == 'GET':
        meetings = Meeting.objects.filter(host=request.user)
        meetings_data = []
        for m in meetings:
            meetings_data.append({
                "id": str(m.id),
                "title": m.title,
                "host": m.host.email,
                "created_at": m.created_at
            })
        return Response(meetings_data)


@api_view(['GET'])
def participant_get_view(request, meeting_id, user_id):
    return Response({
        "success": True,
        "data": {
            "mic_on": True,
            "video_on": True,
            "hand_raised": False
        }
    })


@api_view(['POST'])
def participant_update_view(request):
    return Response({"success": True})
