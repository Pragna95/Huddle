from django.shortcuts import render

# Create your views here.
from django.http import JsonResponse
from .models import ParticipantState
from .models import Recording
import json


from django.core.cache import cache


from django.utils.timezone import now


import json

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