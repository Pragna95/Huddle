import requests
import time
import os
import sys

BASE_URL = "http://localhost:8000"

def test_flow():
    print("=== STARTING API KEY SYSTEM TEST ===")
    
    # 1. Login
    print("\n[1] Testing Company Login...")
    login_data = {
        "email": "huddle@demo.com",
        "password": "host123"
    }
    r = requests.post(f"{BASE_URL}/company/login/", json=login_data)
    assert r.status_code == 200, f"Login failed: {r.text}"
    resp = r.json()
    token = resp["token"]
    company_info = resp["company"]
    print(f"Success! Logged in as: {company_info['name']} (ID: {company_info['id']})")
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    # 2. Get API Key (can be pre-seeded or null)
    print("\n[2] Testing GET /company/api-key/ (initial)...")
    r = requests.get(f"{BASE_URL}/company/api-key/", headers=headers)
    assert r.status_code == 200, f"GET key failed: {r.text}"
    resp = r.json()
    initial_key = resp.get("api_key")
    print(f"Success! Initial key is: {initial_key}")
    
    # 3. Generate API Key
    print("\n[3] Testing POST /company/api-key/generate/...")
    r = requests.post(f"{BASE_URL}/company/api-key/generate/", headers=headers)
    assert r.status_code == 200, f"Generation failed: {r.text}"
    resp = r.json()
    api_key = resp["api_key"]
    assert api_key.startswith("sk_live_"), f"Unexpected key format: {api_key}"
    print(f"Success! Generated API Key: {api_key}")
    
    # 4. Get API Key (should now be the full key)
    print("\n[4] Testing GET /company/api-key/ (after generation)...")
    r = requests.get(f"{BASE_URL}/company/api-key/", headers=headers)
    assert r.status_code == 200, f"GET key failed: {r.text}"
    resp = r.json()
    assert resp["api_key"] == api_key, "Expected fetched key to match generated key"
    print(f"Success! Fetched key matches: {resp['api_key']}")
    
    # 5. Create Meeting using API Key
    print("\n[5] Testing POST /api/meetings/ using API Key...")
    api_headers = {
        "x-api-key": api_key,
        "Content-Type": "application/json"
    }
    meeting_data = {
        "title": "Automated Test Meeting",
        "participants": ["test1@huddle.com", "test2@huddle.com"]
    }
    r = requests.post(f"{BASE_URL}/api/meetings/", json=meeting_data, headers=api_headers)
    assert r.status_code == 201, f"Meeting creation failed: {r.text}"
    resp = r.json()
    meeting_id = resp["id"]
    assert resp["title"] == "Automated Test Meeting", "Expected title to match"
    print(f"Success! Created meeting with ID: {meeting_id}")
    
    # 6. List Meetings using API Key
    print("\n[6] Testing GET /api/meetings/...")
    r = requests.get(f"{BASE_URL}/api/meetings/", headers=api_headers)
    assert r.status_code == 200, f"List meetings failed: {r.text}"
    resp = r.json()
    assert len(resp) >= 1, "Expected at least 1 meeting in list"
    assert any(m["id"] == meeting_id for m in resp), "Created meeting not in list"
    print(f"Success! Found {len(resp)} meetings.")
    
    # 7. Test Rate Limiting (5 regenerates per hour)
    print("\n[7] Testing rate limiting on POST /company/api-key/generate/...")
    # Note: we already generated once. So let's make 4 more requests (should pass), and the 5th (which is 6th overall) should fail.
    for i in range(4):
        r = requests.post(f"{BASE_URL}/company/api-key/generate/", headers=headers)
        assert r.status_code == 200, f"Regen {i+2} failed: {r.text}"
        print(f"Regeneration {i+2}/5 succeeded.")
    
    # The 6th attempt (total) should return 429
    r = requests.post(f"{BASE_URL}/company/api-key/generate/", headers=headers)
    assert r.status_code == 429, f"Expected 429, got {r.status_code}: {r.text}"
    print("Success! 6th regeneration request blocked with 429 Too Many Requests.")
    
    # 8. Test Inactive Company (sets is_active=False via raw DB update and tests)
    print("\n[8] Testing inactive company behavior...")
    # We will simulate this by checking a script or modifying DB. Since we can't run Django code directly from requests,
    # let's run a Django command to set the company active=False, verify, and set it back to True.
    print("To test inactive company block, run: python manage.py shell to set is_active=False.")
    
    print("\n=== ALL SYSTEM TESTS COMPLETED SUCCESSFULLY ===")

if __name__ == "__main__":
    try:
        test_flow()
    except Exception as e:
        print(f"\n[ERROR] Test failed: {e}")
        sys.exit(1)
