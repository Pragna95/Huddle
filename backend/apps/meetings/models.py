from django.db import models

# Create your models here.
class ParticipantState(models.Model):
    username = models.CharField(max_length=100)
    
    mic_on = models.BooleanField(default=True)
    camera_on = models.BooleanField(default=True)

class Recording(models.Model):

    meeting_link = models.URLField()

    recording_type = models.CharField(
        max_length=20,
        default="VIDEO"
    )

    storage_provider = models.CharField(
        max_length=20,
        default="LOCAL"
    )

    processing_status = models.CharField(
        max_length=20,
        default="STARTED"
    )

    started_by = models.CharField(
        max_length=100
    )

    started_at = models.DateTimeField(
        auto_now_add=True
    )

    ended_at = models.DateTimeField(
        null=True,
        blank=True
    )

    duration_seconds = models.IntegerField(
        default=0
    )

       