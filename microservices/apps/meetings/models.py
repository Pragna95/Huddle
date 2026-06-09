import uuid
import secrets
from django.db import models
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth import get_user_model

class SuperAdmin(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(get_user_model(), on_delete=models.CASCADE, related_name="super_admin_profile")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.email


class Host(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)  # Hashed
    super_admin = models.ForeignKey(SuperAdmin, on_delete=models.SET_NULL, null=True, blank=True, related_name="hosts")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.password and not (self.password.startswith('pbkdf2_sha256$') or self.password.startswith('bcrypt')):
            self.password = make_password(self.password)
        super().save(*args, **kwargs)

    def check_password(self, raw_password):
        if self.password.startswith('pbkdf2_sha256$') or self.password.startswith('bcrypt'):
            return check_password(raw_password, self.password)
        return self.password == raw_password

    def __str__(self):
        return f"{self.name} ({self.email})"


class Company(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    host = models.ForeignKey(Host, on_delete=models.CASCADE, related_name="companies", null=True, blank=True)
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)  # Host login email
    password = models.CharField(max_length=128)  # Hashed
    address = models.TextField(blank=True, default="")
    contact_number = models.CharField(max_length=20, blank=True, default="")
    domain = models.CharField(max_length=255, blank=True, default="")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    # Backwards compatibility fields
    api_key = models.CharField(max_length=40, unique=True, null=True, blank=True)
    api_key_created_at = models.DateTimeField(null=True, blank=True)

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
        return f"{self.name} ({self.email})"


class ApiKey(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name="api_keys")
    key = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.company.name} - {self.key}"


class Application(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    api_key = models.ForeignKey(ApiKey, on_delete=models.SET_NULL, null=True, blank=True, related_name="applications")
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class Meeting(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, default="")
    datetime = models.CharField(max_length=255, null=True, blank=True)
    meeting_id = models.CharField(max_length=50, null=True, blank=True)
    link = models.CharField(max_length=255, null=True, blank=True)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name="meetings", null=True, blank=True)
    application = models.ForeignKey(Application, on_delete=models.SET_NULL, null=True, blank=True, related_name="meetings")
    created_at = models.DateTimeField(auto_now_add=True)
    
    # New hybrid fields
    host = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name="hosted_meetings_list", null=True, blank=True)
    start_time = models.DateTimeField(null=True, blank=True)
    meeting_token = models.UUIDField(default=uuid.uuid4, null=True, blank=True)
    is_active = models.BooleanField(default=True)

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

