from django.contrib import admin
from .models import Company, Meeting, Participant

@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'is_active', 'api_key_created_at')
    search_fields = ('name', 'email')

@admin.register(Meeting)
class MeetingAdmin(admin.ModelAdmin):
    list_display = ('title', 'company', 'created_at')
    search_fields = ('title', 'company__email')

@admin.register(Participant)
class ParticipantAdmin(admin.ModelAdmin):
    list_display = ('meeting', 'user_email', 'user_id', 'joined_at')
    search_fields = ('user_email', 'user_id', 'meeting__title')
