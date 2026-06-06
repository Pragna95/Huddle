import secrets
from django.core.management.base import BaseCommand
from django.utils import timezone
from apps.meetings.models import Company

class Command(BaseCommand):
    help = 'Seeds the database with test hosts/companies'

    def handle(self, *args, **options):
        companies_data = [
            {"email": "huddle@demo.com", "name": "Huddle Inc"},
            {"email": "zoom@demo.com", "name": "Zoom Video"},
            {"email": "meet@demo.com", "name": "Google Meet"},
        ]

        for data in companies_data:
            company, created = Company.objects.get_or_create(
                email=data["email"],
                defaults={
                    "name": data["name"],
                    "is_active": True
                }
            )

            # Ensure company has hashed password
            if created or not company.password.startswith('pbkdf2_sha256$'):
                company.set_password("host123")
                company.save()

            # Generate key if null
            if not company.api_key:
                company.api_key = f"sk_live_{secrets.token_hex(16)}"
                company.api_key_created_at = timezone.now()
                company.save()

            # Masked output
            key = company.api_key
            masked_key = f"sk_live_***{key[-4:]}"
            self.stdout.write(f"Host: {company.email} | Key: {masked_key}")
