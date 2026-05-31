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