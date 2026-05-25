from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid


class User(AbstractUser):

    api_key = models.UUIDField(
        default=uuid.uuid4,
        unique=True,
        editable=False
    )

    is_host = models.BooleanField(default=False)
    participants = models.JSONField(default=list)

    def __str__(self):
        return self.username