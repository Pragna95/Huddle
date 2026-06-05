from django.contrib import admin
from .models import Host, ApiKey, Meeting, Participant

@admin.register(Host)
class HostAdmin(admin.ModelAdmin):
    list_display = ('email', 'company_name', 'is_active')
    search_fields = ('email', 'company_name')

@admin.register(ApiKey)
class ApiKeyAdmin(admin.ModelAdmin):
    list_display = ('key', 'app_name', 'host', 'is_active', 'created_at')
    search_fields = ('key', 'app_name', 'host__email')

@admin.register(Meeting)
class MeetingAdmin(admin.ModelAdmin):
    list_display = ('title', 'host', 'created_at')
    search_fields = ('title', 'host__email')

@admin.register(Participant)
class ParticipantAdmin(admin.ModelAdmin):
    list_display = ('meeting', 'user_email', 'user_id', 'joined_at')
    search_fields = ('user_email', 'user_id', 'meeting__title')
