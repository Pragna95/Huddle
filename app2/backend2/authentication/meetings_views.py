import os
import requests
import re
import datetime
from django.conf import settings
from django.utils.dateparse import parse_datetime
from django.utils.timezone import is_aware, make_aware
from django.utils.timezone import now as tz_now
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny

class ScheduleMeetingProxyView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        api_key = os.getenv('APPLICATION_2_API_KEY')
        if not api_key:
            return Response({"error": "APPLICATION_2_API_KEY is not configured in backend .env file."}, status=status.HTTP_400_BAD_REQUEST)

        # Validate API Key and verify host identity on microservice
        microservice_url = "http://localhost:8000"
        verify_url = f"{microservice_url}/api/verify-key/"
        try:
            verify_res = requests.get(verify_url, headers={"x-api-key": api_key})
            if verify_res.status_code != 200:
                return Response({"error": "Invalid API Key configured in backend environment."}, status=status.HTTP_401_UNAUTHORIZED)
        except requests.exceptions.RequestException as e:
            return Response({"error": f"Failed to connect to meeting microservice: {str(e)}"}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        title = request.data.get('title')
        datetime_val = request.data.get('datetime')
        participant_emails = request.data.get('participant_emails', [])

        # Field validation
        if not title or not datetime_val:
            return Response({"error": "Title and datetime are required fields."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Future schedule check
        try:
            mtg_dt = parse_datetime(datetime_val.split('+')[0])
            if mtg_dt:
                if not is_aware(mtg_dt):
                    mtg_dt = make_aware(mtg_dt)
                if mtg_dt < tz_now():
                    return Response({"error": "Meeting schedule must be in the future."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception:
            pass

        # Email formats check
        email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        for email in participant_emails:
            if not re.match(email_regex, email):
                return Response({"error": f"Invalid participant email format: {email}"}, status=status.HTTP_400_BAD_REQUEST)

        payload = {
            "title": title,
            "datetime": datetime_val,
            "participant_emails": participant_emails
        }

        # Send request to microservice
        schedule_url = f"{microservice_url}/api/schedule-meeting/"
        try:
            res = requests.post(schedule_url, json=payload, headers={"x-api-key": api_key})
            if res.status_code in [200, 201]:
                return Response(res.json(), status=status.HTTP_201_CREATED)
            return Response(res.json(), status=res.status_code)
        except requests.exceptions.RequestException as e:
            return Response({"error": f"Request to microservice failed: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ListMeetingsProxyView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        api_key = os.getenv('APPLICATION_2_API_KEY')
        if not api_key:
            return Response({"error": "APPLICATION_2_API_KEY is not configured in backend .env file."}, status=status.HTTP_400_BAD_REQUEST)

        microservice_url = "http://localhost:8000"
        meetings_url = f"{microservice_url}/api/meetings/"

        try:
            res = requests.get(meetings_url, headers={"x-api-key": api_key})
            if res.status_code == 200:
                return Response(res.json(), status=status.HTTP_200_OK)
            return Response(res.json(), status=res.status_code)
        except requests.exceptions.RequestException as e:
            return Response({"error": f"Request to microservice failed: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ValidateMeetingProxyView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, company, letter, api_key, meeting_id):
        microservice_url = "http://localhost:8000"
        validate_url = f"{microservice_url}/api/meeting/validate/{company}/{letter}/{api_key}/{meeting_id}/"

        try:
            res = requests.get(validate_url)
            if res.status_code == 200:
                return Response(res.json(), status=status.HTTP_200_OK)
            return Response(res.json(), status=res.status_code)
        except requests.exceptions.RequestException as e:
            return Response({"error": f"Request to microservice failed: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
