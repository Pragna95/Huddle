import requests
import os
import django

# Setup Django configuration to verify SQLite records directly
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from apps.meetings.models import Company, Meeting

BASE_URL = "http://localhost:8000"

def test_schedule_flow():
    print("=== STARTING SCHEDULE MEETING TEST ===")

    # 1. Login to get JWT
    print("\n[1] Logging in...")
    login_data = {
        "email": "huddle@demo.com",
        "password": "host123"
    }
    r = requests.post(f"{BASE_URL}/company/login/", json=login_data)
    assert r.status_code == 200, f"Login failed: {r.text}"
    token = r.json()["token"]
    print("Logged in successfully.")

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    # 2. Call schedule-meeting API
    print("\n[2] Calling POST /api/schedule-meeting...")
    payload = {
        "title": "Board Sync Meeting",
        "datetime": "2026-06-10T14:00:00",
        "participant_emails": ["dev1@huddle.com", "dev2@huddle.com"]
    }
    r = requests.post(f"{BASE_URL}/api/schedule-meeting", json=payload, headers=headers)
    assert r.status_code == 200, f"Scheduling failed: {r.text}"
    resp = r.json()
    assert resp["success"] is True
    meeting_id = resp["meeting_id"]
    link = resp["link"]
    print(f"Success! Generated Meeting ID: {meeting_id} | Link: {link}")

    # 3. Verify SQLite DB record
    print("\n[3] Verifying SQLite database entry...")
    meeting_db = Meeting.objects.get(meeting_id=meeting_id)
    assert meeting_db.title == "Board Sync Meeting"
    assert meeting_db.link == link
    print(f"Success! Database entry matches: Title='{meeting_db.title}' Link='{meeting_db.link}'")

    print("\n=== ALL SCHEDULE MEETING TESTS COMPLETED SUCCESSFULLY ===")

if __name__ == "__main__":
    test_schedule_flow()
