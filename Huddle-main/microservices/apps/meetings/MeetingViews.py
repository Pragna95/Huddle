import random
import string
import json
from datetime import datetime
from django.contrib.auth.hashers import check_password
from django.core.signing import Signer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny

from .models import ProductApiKey, Product, User, Meeting

def generate_meeting_code():
    while True:
        segments = [
            ''.join(random.choices(string.ascii_lowercase, k=3)),
            ''.join(random.choices(string.ascii_lowercase, k=4)),
            ''.join(random.choices(string.ascii_lowercase, k=3))
        ]
        code = '-'.join(segments)
        if not Meeting.objects.filter(meeting_code=code).exists():
            return code

class ValidateMeetingView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, company=None, api_key=None, meeting_id=None):
        try:
            meeting = Meeting.objects.get(id=meeting_id)
            return Response({
                'title': meeting.title,
                'datetime': str(meeting.scheduled_start),
                'company_name': company if company else "Unknown",
                'participants': [],
                'meeting_code': meeting.meeting_code,
            }, status=status.HTTP_200_OK)
        except Meeting.DoesNotExist:
            return Response({'error': 'Meeting not found'}, status=status.HTTP_404_NOT_FOUND)

class ScheduleMeetingView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        raw_api_key = request.headers.get('X-Api-Key')
        if not raw_api_key:
            return Response({'error': 'X-Api-Key header is required'}, status=status.HTTP_401_UNAUTHORIZED)

        # Verify API Key
        valid_api_key_obj = None
        for ak in ProductApiKey.objects.filter(is_active=True):
            if check_password(raw_api_key, ak.api_key_hash):
                valid_api_key_obj = ak
                break
        
        if not valid_api_key_obj:
            return Response({'error': 'Invalid API Key'}, status=status.HTTP_401_UNAUTHORIZED)

        product = valid_api_key_obj.product

        # Extract payload
        email = request.data.get('email')
        name = request.data.get('name', 'Unknown User')
        title = request.data.get('title')
        description = request.data.get('description', '')
        datetime_str = request.data.get('datetime')

        if not email or not title or not datetime_str:
            return Response({'error': 'email, title, and datetime are required fields'}, status=status.HTTP_400_BAD_REQUEST)

        # Get or create User
        user, created = User.objects.get_or_create(
            product=product,
            email=email,
            defaults={
                'name': name,
                'external_user_id': email,
                'role': 'host'
            }
        )

        # Generate unique meeting code
        meeting_code = generate_meeting_code()

        # Create Meeting
        # Parse datetime string if necessary, but DRF/Django models usually handle ISO strings well
        meeting = Meeting.objects.create(
            product=product,
            created_by_user=user,
            title=title,
            description=description,
            meeting_code=meeting_code,
            status='scheduled',
            scheduled_start=datetime_str
        )

        # Encrypt the API key
        signer = Signer()
        encrypted_api_key = signer.sign(raw_api_key)

        return Response({
            'message': 'Meeting scheduled successfully',
            'meeting_id': str(meeting.id),
            'meeting_code': meeting.meeting_code,
            'encrypted_api_key': encrypted_api_key
        }, status=status.HTTP_201_CREATED)
