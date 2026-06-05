import secrets
from django.core.management.base import BaseCommand
from django.conf import settings
from authentication.models import ApiKey

class Command(BaseCommand):
    help = 'Generate initial API keys for the backend'

    def handle(self, *args, **options):
        app_name = getattr(settings, 'APP_NAME', 'app2')
        
        # We use a default key that matches the microservices valid API keys settings
        # to ensure local testing works out of the box.
        if app_name == 'app1':
            default_key = 'app1_sk_abcdefghijklmnopqrstuvwxyz123456'
        else:
            default_key = 'app2_sk_abcdefghijklmnopqrstuvwxyz123456'
            
        key_record, created = ApiKey.objects.get_or_create(
            app_name=app_name,
            defaults={
                'key': default_key,
                'is_active': True
            }
        )
        
        if created:
            self.stdout.write(self.style.SUCCESS(f"Created initial API key for {app_name}: {key_record.key}"))
        else:
            self.stdout.write(self.style.WARNING(f"API key for {app_name} already exists: {key_record.key}"))
