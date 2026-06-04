from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.utils.timezone import now
from django.core.cache import cache
import json

from .models import ParticipantState, Recording
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

@csrf_exempt
def toggle_mic(request):
    """
    Maintained for backwards-compatibility.
    Updates mic status and broadcasts change.
    """
    if request.method == "POST":
        data = json.loads(request.body)
        user_id = data.get("user_id")
        meeting_id = data.get("meeting_id")
        mic_on = data.get("mic_on")
        username = data.get("username", f"User_{user_id}")

        participant, created = ParticipantState.objects.get_or_create(
            user_id=user_id,
            meeting_id=meeting_id,
            defaults={"username": username}
        )

        participant.mic_on = mic_on
        participant.save()

        # Broadcast update over WebSockets
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f"meeting_{meeting_id}",
            {
                "type": "participant_update",
                "data": {
                    "event": "state_changed",
                    "user_id": user_id,
                    "mic_on": participant.mic_on,
                    "video_on": participant.video_on,
                    "hand_raised": participant.hand_raised
                }
            }
        )

        return JsonResponse({
            "message": "Mic state updated",
            "mic_on": participant.mic_on
        })
    return JsonResponse({"error": "Only POST allowed"}, status=400)


@csrf_exempt
def start_recording(request):
    if request.method == "POST":
        data = json.loads(request.body)
        meeting_link = data.get("meeting_link")
        started_by = data.get("started_by")

        recording = Recording.objects.create(
            meeting_link=meeting_link,
            started_by=started_by,
            processing_status="STARTED"
        )

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
    return JsonResponse({"error": "Only POST allowed"}, status=400)

    
@csrf_exempt
def stop_recording(request):
    if request.method == "POST":
        data = json.loads(request.body)
        recording_id = data.get("recording_id")
        meeting_link = data.get("meeting_link")

        try:
            recording = Recording.objects.get(id=recording_id)
        except Recording.DoesNotExist:
            return JsonResponse({"error": "Recording session not found"}, status=404)

        recording.processing_status = "STOPPED"
        recording.ended_at = now()
        duration = (recording.ended_at - recording.started_at).seconds
        recording.duration_seconds = duration
        recording.save()

        cache.set(
            f"meeting:{meeting_link}:recording",
            {"recording": False},
            timeout=None
        )

        return JsonResponse({
            "message": "Recording Stopped",
            "duration": duration
        })
    return JsonResponse({"error": "Only POST allowed"}, status=400)


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

        if current:
            return JsonResponse({
                "message": "Someone is already sharing screen",
                "current_user": current.get("user_id")
            }, status=400)

        screen_data = {
            "user_id": user_id,
            "started_at": int(now().timestamp())
        }
        cache.set(key, screen_data, timeout=None)

        return JsonResponse({
            "message": "Screen sharing started",
            "user_id": user_id
        })
    return JsonResponse({"error": "Only POST allowed"}, status=400)


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

        if not current:
            return JsonResponse({"message": "No active screen share"}, status=400)

        if current.get("user_id") != user_id:
            return JsonResponse({"message": "You are not the active screen sharer"}, status=403)

        cache.delete(key)
        return JsonResponse({"message": "Screen sharing stopped"})
    return JsonResponse({"error": "Only POST allowed"}, status=400)


def current_screen_sharer(request, meeting_link):
    key = f"meeting:{meeting_link}:screen_share"
    screen_share = cache.get(key)
    return JsonResponse({"screen_share": screen_share})

@csrf_exempt
def get_participant(request, meeting_id, user_id):
    # Automatically create a default state if they don't exist yet
    participant, created = ParticipantState.objects.get_or_create(
        meeting_id=meeting_id,
        user_id=user_id,
        defaults={
            "username": f"User_{user_id}",
            "mic_on": True,
            "video_on": True,
            "hand_raised": False
        }
    )

    return JsonResponse({
        "data": {
            "user_id": participant.user_id,
            "username": participant.username,
            "meeting_id": participant.meeting_id,
            "mic_on": participant.mic_on,
            "video_on": participant.video_on,
            "hand_raised": participant.hand_raised
        }
    })

@csrf_exempt
def update_participant(request):
    if request.method == "POST":
        data = json.loads(request.body)

        user_id = data.get("user_id")
        meeting_id = data.get("meeting_id")
        username = data.get("username", f"User_{user_id}")
        mic_on = data.get("mic_on")
        video_on = data.get("video_on")
        hand_raised = data.get("hand_raised")

        # Fixed: Query on user_id, default username if newly created
        participant, created = ParticipantState.objects.get_or_create(
            user_id=user_id,
            meeting_id=meeting_id,
            defaults={"username": username}
        )

        if username and not created:
            participant.username = username

        participant.mic_on = mic_on
        participant.video_on = video_on   
        participant.hand_raised = hand_raised
        participant.save()

        # Broadcast update to websocket layer
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f"meeting_{meeting_id}",
            {
                "type": "participant_update",
                "data": {
                    "event": "state_changed",
                    "user_id": participant.user_id,
                    "username": participant.username,
                    "mic_on": participant.mic_on,
                    "video_on": participant.video_on,
                    "hand_raised": participant.hand_raised
                }
            }
        )

        return JsonResponse({
            "message": "Participant updated",
            "data": {
                "user_id": participant.user_id,
                "username": participant.username,
                "meeting_id": meeting_id,
                "mic_on": participant.mic_on,
                "video_on": participant.video_on,
                "hand_raised": participant.hand_raised
            }
        })

    return JsonResponse({"error": "Only POST allowed"}, status=400)


@csrf_exempt
def get_all_participants(request, meeting_id):
    participants = ParticipantState.objects.filter(meeting_id=meeting_id)
    data = [
        {
            "user_id": p.user_id,
            "username": p.username,
            "mic_on": p.mic_on,
            "video_on": p.video_on,
            "hand_raised": p.hand_raised
        }
        for p in participants
    ]
    return JsonResponse({"data": data})