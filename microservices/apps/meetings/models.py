import uuid
from django.db import models
from django.contrib.auth.hashers import make_password, check_password

class Host(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    company_name = models.CharField(max_length=255)
    password = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)

    @property
    def is_authenticated(self):
        return True

    @property
    def is_anonymous(self):
        return False

    def save(self, *args, **kwargs):
        if self.password and not (self.password.startswith('pbkdf2_sha256$') or self.password.startswith('bcrypt')):
            self.password = make_password(self.password)
        super().save(*args, **kwargs)

    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        if self.password.startswith('pbkdf2_sha256$') or self.password.startswith('bcrypt'):
            return check_password(raw_password, self.password)
        return self.password == raw_password

    def __str__(self):
        return f"{self.company_name} ({self.email})"


class ApiKey(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    key = models.CharField(max_length=255, unique=True)
    app_name = models.CharField(max_length=100)
    host = models.ForeignKey(Host, on_delete=models.CASCADE, related_name="api_keys")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.app_name} - {self.key}"


class Meeting(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    host = models.ForeignKey(Host, on_delete=models.CASCADE, related_name="meetings")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Participant(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    meeting = models.ForeignKey(Meeting, on_delete=models.CASCADE, related_name="participants")
    user_email = models.EmailField()
    user_id = models.CharField(max_length=255)
    joined_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user_email} in {self.meeting.title}"
