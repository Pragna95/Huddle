from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail

from .models import Meeting
from .utils import (
    verify_api_key,
    generate_meeting_code
)

import json


# -----------------------------------
# CREATE MEETING
# -----------------------------------
@csrf_exempt
def create_meeting(request):

    # ALLOW ONLY POST
    if request.method != "POST":
        return JsonResponse({
            "error": "Method not allowed"
        }, status=405)

    # -----------------------------------
    # GET AUTH HEADER
    # -----------------------------------
    auth_header = request.headers.get("Authorization")

    if not auth_header:
        return JsonResponse({
            "error": "API key missing"
        }, status=401)

    # -----------------------------------
    # CHECK AUTH FORMAT
    # -----------------------------------
    if not auth_header.startswith("Bearer "):
        return JsonResponse({
            "error": "Invalid authorization format"
        }, status=401)

    # -----------------------------------
    # EXTRACT RAW API KEY
    # -----------------------------------
    raw_key = auth_header.split(" ")[1]

    # -----------------------------------
    # VERIFY API KEY
    # -----------------------------------
    api_key = verify_api_key(raw_key)

    if not api_key:
        return JsonResponse({
            "error": "Invalid API key"
        }, status=401)

    # -----------------------------------
    # PARSE REQUEST BODY
    # -----------------------------------
    try:
        data = json.loads(request.body)

    except:
        return JsonResponse({
            "error": "Invalid JSON body"
        }, status=400)

    # -----------------------------------
    # REQUIRED FIELDS
    # -----------------------------------
    title = data.get("title")
    description = data.get("description")

    if not title:
        return JsonResponse({
            "error": "Title is required"
        }, status=400)

    # -----------------------------------
    # GENERATE CLEAN MEETING CODE
    # -----------------------------------
    meeting_code = generate_meeting_code()

    # -----------------------------------
    # CREATE MEETING
    # -----------------------------------
    meeting = Meeting.objects.create(
        product=api_key.product,
        title=title,
        description=description,
        meeting_code=meeting_code,
        status="scheduled"
    )

    # -----------------------------------
    # CLEAN PUBLIC MEETING LINK
    # -----------------------------------
    meeting_link = (
        f"https://meet.gadigital.com/meet/"
        f"{meeting.meeting_code}"
    )

    # -----------------------------------
    # VERIFY MEETING EXISTS
    # -----------------------------------
    exists = Meeting.objects.filter(
        meeting_code=meeting.meeting_code
    ).exists()

    if not exists:
        return JsonResponse({
            "error": "Meeting verification failed"
        }, status=500)

    # -----------------------------------
    # GET ATTENDEE EMAILS
    # -----------------------------------
    emails = [
        attendee["email"]
        for attendee in data.get("attendees", [])
        if attendee.get("email")
    ]

    # -----------------------------------
    # SEND EMAILS
    # -----------------------------------
    if emails:

        send_mail(
            subject=f"Meeting Invite: {title}",

            message=f"""
Meeting: {title}

Description:
{description}

Join Meeting:
{meeting_link}
""",

            from_email=None,
            recipient_list=emails,
            fail_silently=False
        )

    # -----------------------------------
    # SUCCESS RESPONSE
    # -----------------------------------
    return JsonResponse({
        "message": "Meeting created successfully",
        "meeting_code": meeting.meeting_code,
        "meeting_link": meeting_link,
        "product": api_key.product.name
    })


# -----------------------------------
# JOIN MEETING
# -----------------------------------
def join_meeting(request, meeting_code):

    try:

        # VERIFY MEETING
        meeting = Meeting.objects.get(
            meeting_code=meeting_code
        )

        return JsonResponse({
            "meeting_title": meeting.title,
            "meeting_code": meeting.meeting_code,
            "status": meeting.status,
            "message": "Meeting verified successfully"
        })

    except Meeting.DoesNotExist:

        return JsonResponse({
            "error": "Invalid meeting link"
        }, status=404)