import os
import django
import requests

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from apps.meetings.models import Company

BASE_URL = "http://localhost:8000"

def test_inactive():
    company = Company.objects.get(email="huddle@demo.com")
    
    # Generate an API key if not set
    if not company.api_key:
        company.api_key = "sk_live_testkey1234567890abcdef"
        import django.utils.timezone as timezone
        company.api_key_created_at = timezone.now()
        company.save()
        
    api_key = company.api_key
    print(f"Company API Key is: {api_key}")
    
    # 1. Set Company to inactive
    print("Setting company is_active = False...")
    company.is_active = False
    company.save()
    
    # 2. Call /api/meetings/ (should return 403 Forbidden)
    api_headers = {
        "x-api-key": api_key,
        "Content-Type": "application/json"
    }
    
    try:
        r = requests.get(f"{BASE_URL}/api/meetings/", headers=api_headers)
        print(f"Response status: {r.status_code}")
        assert r.status_code == 403, f"Expected 403 Forbidden for inactive company, got: {r.status_code}"
        print("Success! Request was correctly blocked with 403 Forbidden.")
    finally:
        # Restore active state
        print("Restoring company is_active = True...")
        company.is_active = True
        company.save()

if __name__ == "__main__":
    test_inactive()
