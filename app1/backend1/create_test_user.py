#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from authentication.models import CustomUser

# Check existing users
print("Existing users:")
for user in CustomUser.objects.all():
    print(f"  - {user.username} ({user.email})")

# Try to create a new user
try:
    user = CustomUser.objects.create_user(
        username='demo',
        email='demo@example.com',
        password='demo123'
    )
    print(f"\n✓ Created user: {user.username} ({user.email})")
except Exception as e:
    print(f"\n✗ Error creating user: {e}")
    # Try another email if the first one exists
    try:
        user = CustomUser.objects.create_user(
            username='demo2',
            email='demo2@example.com',
            password='demo123'
        )
        print(f"✓ Created user: {user.username} ({user.email})")
    except Exception as e2:
        print(f"✗ Error creating second user: {e2}")
