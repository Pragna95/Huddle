from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
import json
import uuid


@csrf_exempt
def create_meeting(request):
    if request.method == "POST":
        data = json.loads(request.body)

        meeting_link = f"https://meet.gadigital.com/{uuid.uuid4().hex[:8]}"

        emails = [
            attendee["email"]
            for attendee in data.get("attendees", [])
            if attendee.get("email")
        ]

        send_mail(
            subject=f"Meeting Invite: {data['title']}",
            message=f"""
Meeting: {data['title']}
Date: {data['startDate']}
Time: {data['startTime']}

Join here:
{meeting_link}
""",
            from_email=None,
            recipient_list=emails,
            fail_silently=False
        )

        return JsonResponse({
            "message": "Meeting created",
            "meeting_link": meeting_link
        })