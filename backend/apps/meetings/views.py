from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
# from .models import Meeting, MeetingParticipant
from apps.users.models import User
from datetime import datetime
from django.utils import timezone
from .utils import (
    verify_api_key,
    generate_meeting_code
)
from .models import (
    Meeting,
    MeetingParticipant,
    RecurrenceRule
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
    start_date = data.get("start_date")
    start_time = data.get("start_time")
    end_time = data.get("end_time")
    all_day = data.get("all_day", False)
    recurrence_type = data.get("recurrence_type")
    weekdays = data.get("weekdays", [])

    if not title:
        return JsonResponse({
            "error": "Title is required"
        }, status=400)
    attendees = data.get("attendees", [])
    if not attendees:
        return JsonResponse({
        "error": "At least one participant is required"
    }, status=400)
    # -----------------------------------
    # GENERATE CLEAN MEETING CODE
    # -----------------------------------
    # meeting_code = generate_meeting_code()
    while True:
        meeting_code = generate_meeting_code()
        if not Meeting.objects.filter(
            meeting_code=meeting_code
            ).exists():
            break


    scheduled_start = None
    scheduled_end = None
    if start_date and start_time:
        scheduled_start = timezone.make_aware(
        datetime.strptime(
            f"{start_date} {start_time}",
            "%Y-%m-%d %H:%M"
        )
    )
    if start_date and end_time:
        scheduled_end = timezone.make_aware(
        datetime.strptime(
            f"{start_date} {end_time}",
            "%Y-%m-%d %H:%M"
        )
    )
    if scheduled_start and scheduled_end:
        if scheduled_end <= scheduled_start:
            return JsonResponse({
            "error": "End time must be after start time"
        }, status=400)

    # -----------------------------------
    # CREATE MEETING
    # -----------------------------------
    meeting = Meeting.objects.create(
        product=api_key.product,
        title=title,
        description=description,
        meeting_code=meeting_code,
        status="scheduled",
        scheduled_start=scheduled_start,
        scheduled_end=scheduled_end,
        settings={
            "all_day": all_day}
       
    )
    if recurrence_type:
        RecurrenceRule.objects.create(
            meeting=meeting,
            recurrence_type=recurrence_type,
            weekdays=weekdays
            )

    # -----------------------------------
    # CLEAN PUBLIC MEETING LINK
    # -----------------------------------
    meeting_link = request.build_absolute_uri(
    f"/api/meetings/meet/{meeting.meeting_code}/"
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
    for attendee in data.get("attendees", []):
        email = attendee.get("email")
        if not email:
            continue
        user = User.objects.filter(
            email=email,
            is_active=True
            ).first()
        if user:
            MeetingParticipant.objects.get_or_create(
                meeting=meeting,
                user=user,
                defaults={
                    "invitation_status": "invited",
                    "joined_once": False,
                    })
            
    #     attendees = data.get("attendees", [])
    # if not attendees:
    #     return JsonResponse({
    #             "error": "At least one participant is required"
    #             }, status=400)
           

    # -----------------------------------
    # SEND EMAILS
    # -----------------------------------
    if emails:

        send_mail(
            subject=f"Meeting Invite: {title}",

           message=f"""
Meeting Invitation

Title:
{title}

Description:
{description}

Start:
{scheduled_start}

End:
{scheduled_end}

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

    "title": meeting.title,

    "scheduled_start": meeting.scheduled_start,

    "scheduled_end": meeting.scheduled_end,

    "participants_count":
        meeting.participants.count(),

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
from .models import Meeting


def meeting_participants(request, meeting_code):
    try:
        meeting = Meeting.objects.get(
            meeting_code=meeting_code
        )

        participants = []

        for participant in meeting.participants.select_related("user"):
            participants.append({
                "name": participant.user.name,
                "email": participant.user.email,
                "status": participant.invitation_status,
                "joined": participant.joined_once
            })

        return JsonResponse({
            "meeting_title": meeting.title,
            "participants": participants
        })

    except Meeting.DoesNotExist:
        return JsonResponse({
            "error": "Meeting not found"
        }, status=404)