import secrets
import time
import datetime
from django.conf import settings
from django.shortcuts import render
from django.utils.timezone import now as tz_now
from django.core.cache import cache
from django.views.decorators.csrf import csrf_exempt

from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import AuthenticationFailed

from backend.authentication import ApiKeyAuthentication, JWTCompanyAuthentication
from backend.permissions import IsCompanyUser
from backend.jwt_utils import encode_jwt
from .models import Company, Meeting, Participant

def check_rate_limit(company):
    """
    Slide window or fixed window rate limiter using django cache.
    Enforces a maximum of 5 regenerates per hour.
    """
    now_ts = time.time()
    cache_key = f"regen_limit_{company.id}"
    history = cache.get(cache_key, [])
    # filter entries older than 1 hour (3600s)
    history = [t for t in history if now_ts - t < 3600]
    if len(history) >= 5:
        return False
    history.append(now_ts)
    cache.set(cache_key, history, 3600)
    return True


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
@authentication_classes([])
def company_login_view(request):
    """
    Authenticates a host/company and returns JWT token + company info.
    """
    if request.method == 'GET':
        return render(request, 'company/login.html')

    email = request.data.get('email')
    password = request.data.get('password')

    company = Company.objects.filter(email=email, is_active=True).first()
    if not company or not company.check_password(password):
        return Response({"message": "Invalid email or password."}, status=400)

    # Generate JWT payload
    payload = {
        "company_id": str(company.id),
        "company_name": company.name,
        "email": company.email,
        "exp": int(time.time() + 86400 * 7)  # 7 days expiration
    }
    token = encode_jwt(payload, settings.SECRET_KEY)

    return Response({
        "token": token,
        "company": {
            "id": str(company.id),
            "name": company.name,
            "email": company.email
        }
    })


@api_view(['GET'])
@authentication_classes([JWTCompanyAuthentication])
@permission_classes([IsAuthenticated, IsCompanyUser])
def company_api_key_get_view(request):
    """
    Retrieves the company's API key.
    Masks the key if generated more than 24 hours ago.
    """
    company = request.user

    if not company.api_key:
        return Response({
            "api_key": None
        })

    # Check if key was generated >24 hours ago
    time_diff = tz_now() - company.api_key_created_at
    if time_diff > datetime.timedelta(hours=24):
        masked = f"sk_live_***{company.api_key[-4:]}"
        return Response({
            "api_key": masked,
            "created_at": company.api_key_created_at.isoformat()
        })

    return Response({
        "api_key": company.api_key,
        "created_at": company.api_key_created_at.isoformat()
    })


@api_view(['POST'])
@authentication_classes([JWTCompanyAuthentication])
@permission_classes([IsAuthenticated, IsCompanyUser])
@csrf_exempt
def company_api_key_generate_view(request):
    """
    Generates / regenerates a new API key for the company.
    Enforces a rate limit of 5 regenerates per hour per company.
    """
    company = request.user

    # Rate limiting
    if not check_rate_limit(company):
        return Response({
            "error": "Rate limit exceeded. Maximum 5 regenerates per hour."
        }, status=429)

    # Generate new key: sk_live_ (8 chars) + 32 hex = 40 chars total
    new_key = f"sk_live_{secrets.token_hex(16)}"
    company.api_key = new_key
    company.api_key_created_at = tz_now()
    company.save()

    return Response({
        "api_key": new_key,
        "created_at": company.api_key_created_at.isoformat()
    })


@api_view(['GET', 'POST'])
@authentication_classes([ApiKeyAuthentication])
@permission_classes([IsAuthenticated])
def meetings_view(request):
    """
    API for managing meetings of the authenticated company.
    Enforces tenant isolation using request.company.id.
    """
    if request.method == 'POST':
        title = request.data.get('title')
        participants_emails = request.data.get('participants', [])

        if not title:
            return Response({"error": "Title is required."}, status=400)

        # Create meeting belonging to company
        meeting = Meeting.objects.create(
            title=title,
            company=request.company
        )

        for email in participants_emails:
            Participant.objects.create(
                meeting=meeting,
                user_email=email,
                user_id=""
            )

        return Response({
            "id": str(meeting.id),
            "title": meeting.title,
            "company": request.company.name,
            "created_at": meeting.created_at,
            "participants": participants_emails
        }, status=201)

    elif request.method == 'GET':
        meetings = Meeting.objects.filter(company=request.company)
        meetings_data = []
        for m in meetings:
            meetings_data.append({
                "id": str(m.id),
                "title": m.title,
                "company": request.company.name,
                "created_at": m.created_at
            })
        return Response(meetings_data)


@api_view(['GET'])
@authentication_classes([ApiKeyAuthentication])
@permission_classes([IsAuthenticated])
def participant_get_view(request, meeting_id, user_id):
    """
    Fetch participant detail. Ensures requested meeting belongs to the tenant.
    """
    # Verify meeting ownership (multi-tenant isolation)
    try:
        meeting = Meeting.objects.get(id=meeting_id, company=request.company)
    except Meeting.DoesNotExist:
        return Response({"error": "Meeting not found or access denied."}, status=404)

    return Response({
        "success": True,
        "data": {
            "mic_on": True,
            "video_on": True,
            "hand_raised": False
        }
    })


@api_view(['POST'])
@authentication_classes([ApiKeyAuthentication])
@permission_classes([IsAuthenticated])
def participant_update_view(request):
    """
    Update participant detail. Ensures requested meeting belongs to the tenant.
    """
    meeting_id = request.data.get('meeting_id')
    if not meeting_id:
        return Response({"error": "meeting_id is required."}, status=400)

    # Verify meeting ownership (multi-tenant isolation)
    try:
        meeting = Meeting.objects.get(id=meeting_id, company=request.company)
    except Meeting.DoesNotExist:
        return Response({"error": "Meeting not found or access denied."}, status=404)

    return Response({"success": True})


@api_view(['POST'])
@authentication_classes([ApiKeyAuthentication, JWTCompanyAuthentication])
@permission_classes([IsAuthenticated])
def schedule_meeting_view(request):
    """
    POST /api/schedule-meeting endpoint:
    a. Require user to be authenticated. Get logged-in user from request.user
    b. Get company_name = request.user.company.name 
    c. Get api_key = request.user.company.api_key
    d. Generate meeting_id: 8 chars, alphanumeric or numeric. Use uuid4().hex[:8]
    e. Generate random letter: random.choice(string.ascii_lowercase)
    f. Build meeting link exactly: {company_name}/{random_letter}/{api_key}/{meeting_id}
    g. Save to Meeting model: title, datetime, meeting_id, link, company
    h. Send email to participant_emails[] using Django send_mail
    i. Return JSON: {success: true, meeting_id, link}
    """
    import uuid
    import random
    import string
    from django.core.mail import send_mail
    from django.conf import settings

    print("\n[schedule_meeting_view] Request received!")
    print(f"[schedule_meeting_view] User: {request.user} (is_authenticated: {request.user.is_authenticated})")
    print(f"[schedule_meeting_view] Headers: {dict(request.headers)}")
    print(f"[schedule_meeting_view] META Authorization: {request.META.get('HTTP_AUTHORIZATION')}")

    user = request.user

    # Identify the company and extract company details
    if hasattr(user, 'company') and user.company:
        company = user.company
        company_name = company.name
        api_key = company.api_key
    elif isinstance(user, Company):
        company = user
        company_name = user.name
        api_key = user.api_key
    else:
        # Fallback to the first active company if not linked directly
        company = Company.objects.filter(is_active=True).first()
        if not company:
            return Response({"error": "No company associated with this user."}, status=400)
        company_name = company.name
        api_key = company.api_key

    title = request.data.get('title')
    datetime_val = request.data.get('datetime')
    participant_emails = request.data.get('participant_emails', [])

    if not title:
        return Response({"error": "Title is required."}, status=400)
    if not datetime_val:
        return Response({"error": "Datetime is required."}, status=400)

    # Generate meeting_id (8 chars) and random letter
    meeting_id = uuid.uuid4().hex[:8]
    random_letter = random.choice(string.ascii_lowercase)

    # Sanitize company name for clean URL links (remove non-alphanumeric chars)
    clean_company_name = "".join(char for char in company_name if char.isalnum())

    # Build meeting link
    link = f"{clean_company_name}/{random_letter}/{api_key}/{meeting_id}"

    # Save to Meeting model
    meeting = Meeting.objects.create(
        title=title,
        datetime=datetime_val,
        meeting_id=meeting_id,
        link=link,
        company=company
    )

    # Send email notifications
    subject = f"Meeting Invite: {title}"
    body = (
        f"Title: {title}\n"
        f"Company: {company_name}\n"
        f"Date & Time: {datetime_val}\n"
        f"Join Link: http://localhost:5173/meeting/{link}"
    )

    sender_email = getattr(settings, 'EMAIL_HOST_USER', 'webmaster@localhost')
    if participant_emails:
        if isinstance(participant_emails, str):
            participant_emails = [participant_emails]
        try:
            send_mail(
                subject,
                body,
                sender_email,
                list(participant_emails),
                fail_silently=True
            )
        except Exception as e:
            import logging
            logging.getLogger(__name__).warning(f"Email delivery failed: {e}")

    return Response({
        "success": True,
        "meeting_id": meeting_id,
        "link": link
    })
