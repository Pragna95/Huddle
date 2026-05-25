from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):

    fieldsets = UserAdmin.fieldsets + (
        (
            'API Configuration',
            {
                'fields': (
                    'api_key',
                    'is_host',
                )
            },
        ),
    )

    readonly_fields = ['api_key']