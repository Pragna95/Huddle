<<<<<<< HEAD
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt

# Create your views here.
from django.http import JsonResponse
from .models import ParticipantState
from .models import Recording
import json


from django.core.cache import cache


from django.utils.timezone import now


import json

@csrf_exempt
def toggle_mic(request):

    if request.method == "POST":

        data = json.loads(request.body)

        username = data.get("username")
        
        mic_on = data.get("mic_on")

        participant, created = ParticipantState.objects.get_or_create(
            username=username,
            
        )

        participant.mic_on = mic_on
        participant.save()

        return JsonResponse({
            "message": "Mic state updated",
            "mic_on": participant.mic_on
        })





@csrf_exempt
def start_recording(request):

    if request.method == "POST":

        data = json.loads(request.body)

        meeting_link = data.get("meeting_link")
        started_by = data.get("started_by")

        # PostgreSQL metadata
        recording = Recording.objects.create(
            meeting_link=meeting_link,
            started_by=started_by,
            processing_status="STARTED"
        )

        # Redis realtime state
        cache.set(
            f"meeting:{meeting_link}:recording",
            {
                "recording": True,
                "recording_id": recording.id
            },
            timeout=None
        )

        return JsonResponse({
            "message": "Recording Started",
            "recording_id": recording.id
        })
    
@csrf_exempt
def stop_recording(request):

    if request.method == "POST":

        data = json.loads(request.body)

        recording_id = data.get("recording_id")
        meeting_link = data.get("meeting_link")

        recording = Recording.objects.get(
            id=recording_id
        )

        recording.processing_status = "STOPPED"
        recording.ended_at = now()

        duration = (
            recording.ended_at - recording.started_at
        ).seconds

        recording.duration_seconds = duration

        recording.save()

        # Redis update
        cache.set(
            f"meeting:{meeting_link}:recording",
            {
                "recording": False
            },
            timeout=None
        )

        return JsonResponse({
            "message": "Recording Stopped",
            "duration": duration
        })

# Screen Share
@csrf_exempt
def start_screen_share(request):

    if request.method == "POST":

        data = json.loads(request.body)

        meeting_link = data.get("meeting_link")
        user_id = data.get("user_id")

        if not meeting_link or not user_id:
            return JsonResponse({"message": "Missing data"}, status=400)

        key = f"meeting:{meeting_link}:screen_share"

        current = cache.get(key)

        # Someone already sharing screen
        if current:
            return JsonResponse({
                "message": "Someone is already sharing screen",
                "current_user": current.get("user_id")
            }, status=400)

        #Start screen share
        screen_data = {
            "user_id": user_id,
            "started_at": int(now().timestamp())
        }

        cache.set(key, screen_data, timeout=None)

        return JsonResponse({
            "message": "Screen sharing started",
            "user_id": user_id
        })

@csrf_exempt
def stop_screen_share(request):

    if request.method == "POST":

        data = json.loads(request.body)

        meeting_link = data.get("meeting_link")
        user_id = data.get("user_id")

        if not meeting_link or not user_id:
            return JsonResponse({"message": "Missing data"}, status=400)

        key = f"meeting:{meeting_link}:screen_share"

        current = cache.get(key)

        #  No active share
        if not current:
            return JsonResponse({
                "message": "No active screen share"
            }, status=400)

        #  Only active sharer can stop (Zoom behavior)
        if current.get("user_id") != user_id:
            return JsonResponse({
                "message": "You are not the active screen sharer"
            }, status=403)

        cache.delete(key)

        return JsonResponse({
            "message": "Screen sharing stopped"
        })

def current_screen_sharer(request, meeting_link):

    key = f"meeting:{meeting_link}:screen_share"

    screen_share = cache.get(key)

    return JsonResponse({
        "screen_share": screen_share
    })
=======
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core.mail import send_mail

import json
import uuid
import requests


@csrf_exempt
def create_meeting(request):

    if request.method == "POST":

        try:

            data = json.loads(request.body)

            received_key = request.headers.get("API_KEY")

            if received_key != "huddle123":

                return JsonResponse({
                    "error": "Invalid API Key"
                }, status=403)

            meeting_link = f"https://meet.gadigital.com/{uuid.uuid4().hex[:8]}"

            return JsonResponse({
                "message": "Meeting created successfully",
                "meeting_link": meeting_link
            })

        except Exception as e:

            return JsonResponse({
                "error": str(e)
            }, status=400)

    return JsonResponse({
        "error": "Only POST method allowed"
    }, status=405)


@api_view(['GET','POST'])
def schedule_meeting(request):

    try:

        response = requests.post(
            "http://meeting_service:9000/api/create-room/",
            headers={
                "API_KEY": "huddle123"
            },
            json=request.data
        )

        data = response.json()

        meeting_link = data.get("meeting_link")

        emails = [
            attendee["email"]
            for attendee in request.data.get("attendees", [])
            if attendee.get("email")
        ]

        send_mail(
            subject=f"Meeting Invite: {request.data.get('title')}",

            message=f"""
Meeting: {request.data.get('title')}
Date: {request.data.get('startDate')}
Time: {request.data.get('startTime')}

Join here:
{meeting_link}
""",

            from_email="noreply@gadigital.com",

            recipient_list=emails,

            fail_silently=False
        )

        return Response({
            "message": "Meeting Scheduled Successfully",
            "meeting_link": meeting_link
        })

    except Exception as e:

        return Response({
            "error": str(e)
        }, status=400)
>>>>>>> Team-B
