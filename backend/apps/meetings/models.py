import uuid
from django.db import models
from apps.users.models import User, Product

class ParticipantState(models.Model):
    username = models.CharField(max_length=100)
    mic_on = models.BooleanField(default=True)
    camera_on = models.BooleanField(default=True)

    def __str__(self):
        return self.username


class Meeting(models.Model):
    id                      = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product                 = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="meetings")
    created_by_user         = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="meetings_created")
    title                   = models.CharField(max_length=255)
    description             = models.TextField(blank=True, null=True)
    meeting_code            = models.CharField(max_length=100, unique=True, blank=True, null=True)
    status                  = models.CharField(max_length=50)
    scheduled_start         = models.DateTimeField(blank=True, null=True)
    scheduled_end           = models.DateTimeField(blank=True, null=True)
    actual_start            = models.DateTimeField(blank=True, null=True)
    actual_end              = models.DateTimeField(blank=True, null=True)
    timezone                = models.CharField(max_length=100, blank=True, null=True)
    max_participants        = models.IntegerField(blank=True, null=True)
    is_recording_enabled    = models.BooleanField(default=False)
    is_waiting_room_enabled = models.BooleanField(default=False)
    settings                = models.JSONField(blank=True, null=True)
    created_at              = models.DateTimeField(auto_now_add=True)
    updated_at              = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "meetings"

    def __str__(self):
        return self.title


class MeetingParticipant(models.Model):
    id                = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    meeting           = models.ForeignKey(Meeting, on_delete=models.CASCADE, related_name="participants")
    user              = models.ForeignKey(User, on_delete=models.CASCADE, related_name="participations", related_query_name="participation")
    role              = models.CharField(max_length=50, blank=True, null=True)
    invited_by        = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="invitations_sent")
    invitation_status = models.CharField(max_length=50, blank=True, null=True)
    joined_once       = models.BooleanField(default=False)
    created_at        = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "meeting_participants"


class RecurrenceRule(models.Model):
    id              = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    meeting         = models.ForeignKey(Meeting, on_delete=models.CASCADE, related_name="recurrence_rules")
    recurrence_type = models.CharField(max_length=50)
    interval_value  = models.IntegerField(blank=True, null=True)
    weekdays        = models.JSONField(blank=True, null=True)
    end_date        = models.DateTimeField(blank=True, null=True)
    created_at      = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "recurrence_rules"


class MeetingSession(models.Model):
    id                     = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    meeting                = models.ForeignKey(Meeting, on_delete=models.CASCADE, related_name="sessions")
    started_by_user        = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="sessions_started")
    session_number         = models.IntegerField(blank=True, null=True)
    status                 = models.CharField(max_length=50, blank=True, null=True)
    started_at             = models.DateTimeField(blank=True, null=True)
    ended_at               = models.DateTimeField(blank=True, null=True)
    peak_participant_count = models.IntegerField(default=0)
    total_duration_seconds = models.IntegerField(default=0)
    recording_status       = models.CharField(max_length=50, blank=True, null=True)
    metadata               = models.JSONField(blank=True, null=True)
    created_at             = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "meeting_sessions"


class ParticipantSession(models.Model):
    id                            = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    meeting_session               = models.ForeignKey(MeetingSession, on_delete=models.CASCADE, related_name="participant_sessions")
    user                          = models.ForeignKey(User, on_delete=models.CASCADE, related_name="participant_sessions")
    joined_at                     = models.DateTimeField(blank=True, null=True)
    left_at                       = models.DateTimeField(blank=True, null=True)
    duration_seconds              = models.IntegerField(default=0)
    reconnect_count               = models.IntegerField(default=0)
    speaking_duration_seconds     = models.IntegerField(default=0)
    screen_share_duration_seconds = models.IntegerField(default=0)
    network_avg_latency           = models.FloatField(blank=True, null=True)
    metadata                      = models.JSONField(blank=True, null=True)

    class Meta:
        db_table = "participant_sessions"


class Recording(models.Model):
    # Unified model supporting HEAD & Team-B fields
    id                = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    meeting_session   = models.ForeignKey(MeetingSession, on_delete=models.CASCADE, related_name="recordings", null=True, blank=True)
    meeting_link      = models.URLField(null=True, blank=True)
    recording_type    = models.CharField(max_length=50, default="VIDEO")
    storage_provider  = models.CharField(max_length=100, default="LOCAL")
    file_path         = models.TextField(blank=True, null=True)
    file_size_bytes   = models.BigIntegerField(blank=True, null=True)
    duration_seconds  = models.IntegerField(default=0)
    mime_type         = models.CharField(max_length=100, blank=True, null=True)
    processing_status = models.CharField(max_length=50, default="STARTED")
    started_by        = models.CharField(max_length=100, blank=True, null=True)
    started_at        = models.DateTimeField(auto_now_add=True)
    ended_at          = models.DateTimeField(null=True, blank=True)
    created_at        = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "recordings"


class Transcript(models.Model):
    id                = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    meeting_session   = models.ForeignKey(MeetingSession, on_delete=models.CASCADE, related_name="transcripts")
    recording         = models.ForeignKey(Recording, on_delete=models.SET_NULL, null=True, related_name="transcripts")
    language          = models.CharField(max_length=20, blank=True, null=True)
    transcript_text   = models.TextField(blank=True, null=True)
    summary_text      = models.TextField(blank=True, null=True)
    action_items      = models.JSONField(blank=True, null=True)
    generated_by      = models.CharField(max_length=100, blank=True, null=True)
    processing_status = models.CharField(max_length=50, blank=True, null=True)
    created_at        = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "transcripts"
