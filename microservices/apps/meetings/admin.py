from django.contrib import admin
from .models import Company, Meeting, Participant, SuperAdmin, Host, ApiKey, Application

@admin.register(SuperAdmin)
class SuperAdminAdmin(admin.ModelAdmin):
    list_display = ('user', 'created_at')
    search_fields = ('user__email',)

@admin.register(Host)
class HostAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'is_active', 'created_at')
    search_fields = ('name', 'email')

@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'host', 'is_active', 'created_at')
    search_fields = ('name', 'email')

@admin.register(ApiKey)
class ApiKeyAdmin(admin.ModelAdmin):
    list_display = ('company', 'key', 'is_active', 'created_at')
    search_fields = ('company__name', 'key')

@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ('name', 'api_key', 'is_active')
    search_fields = ('name',)

@admin.register(Meeting)
class MeetingAdmin(admin.ModelAdmin):
    list_display = ('title', 'company', 'application', 'created_at')
    search_fields = ('title', 'company__email', 'application__name')

@admin.register(Participant)
class ParticipantAdmin(admin.ModelAdmin):
    list_display = ('meeting', 'user_email', 'user_id', 'joined_at')
    search_fields = ('user_email', 'user_id', 'meeting__title')
