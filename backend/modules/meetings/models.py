from django.db import models

# Create your models here.
from django.db import models
from django.conf import settings
import uuid


class Meeting(models.Model):

    meeting_id = models.UUIDField(
        default=uuid.uuid4,
        editable=False,
        unique=True
    )

    host = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    title = models.CharField(max_length=255)

    description = models.TextField(blank=True)

    scheduled_time = models.DateTimeField()

    created_at = models.DateTimeField(auto_now_add=True)

    is_active = models.BooleanField(default=True)

    @property
    def join_link(self):
        return f"https://huddle.com/join/{self.meeting_id}"

    def __str__(self):
        return self.title