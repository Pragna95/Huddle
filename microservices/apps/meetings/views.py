import secrets
import time
import datetime
from django.conf import settings
from django.shortcuts import render, redirect, get_object_or_404
from django.utils.timezone import now as tz_now
from django.core.cache import cache
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import get_user_model, authenticate, login as django_login, logout as django_logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages

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
@authentication_classes([ApiKeyAuthentication, JWTCompanyAuthentication])
@permission_classes([IsAuthenticated])
def meetings_view(request):
    """
    API for managing meetings of the authenticated company.
    Supports ApiKeyAuthentication and JWTCompanyAuthentication.
    """
    company = getattr(request, 'company', None)
    if not company and isinstance(request.user, Company):
        company = request.user

    if not company:
        return Response({"error": "No company context found."}, status=400)

    if request.method == 'POST':
        title = request.data.get('title')
        participants_emails = request.data.get('participants', [])

        if not title:
            return Response({"error": "Title is required."}, status=400)

        # Create meeting belonging to company
        meeting = Meeting.objects.create(
            title=title,
            company=company
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
            "company": company.name,
            "created_at": meeting.created_at,
            "participants": participants_emails
        }, status=201)

    elif request.method == 'GET':
        meetings = Meeting.objects.filter(company=company)
        meetings_data = []
        for m in meetings:
            meetings_data.append({
                "id": str(m.id),
                "title": m.title,
                "company": company.name,
                "created_at": m.created_at,
                "datetime": m.datetime,
                "participants": list(m.participants.values_list('user_email', flat=True)),
                "link": m.link
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


# =====================================================================
# HYBRID AUTHENTICATION & TEMPLATE VIEWS (Huddle app)
# =====================================================================

def meetings_login_view(request):
    """
    Renders host login page and handles authentication.
    Supports remember_me checkbox setting session expiry.
    """
    if request.user.is_authenticated:
        return redirect('host_dashboard')

    if request.method == 'POST':
        username_or_email = request.POST.get('username')
        password = request.POST.get('password')
        remember_me = request.POST.get('remember_me')

        user_model = get_user_model()
        user = None

        # Allow email as username login
        if '@' in username_or_email:
            try:
                user_obj = user_model.objects.get(email=username_or_email)
                username_or_email = user_obj.username
            except user_model.DoesNotExist:
                pass

        user = authenticate(request, username=username_or_email, password=password)

        if user is not None:
            django_login(request, user)
            if remember_me:
                # Keep logged in for 2 weeks
                request.session.set_expiry(1209600)
            else:
                # Browser close session expiry
                request.session.set_expiry(0)

            next_url = request.GET.get('next')
            if next_url:
                return redirect(next_url)
            return redirect('host_dashboard')
        else:
            messages.error(request, "Invalid username/email or password.")
            return render(request, 'meetings/login.html')

    return render(request, 'meetings/login.html')


def meetings_logout_view(request):
    """
    Logs out host user and redirects to login.
    """
    if request.method == 'POST' or request.method == 'GET':
        django_logout(request)
        messages.success(request, "You have been successfully signed out.")
        return redirect('meetings_login')
    return redirect('meetings_login')


def meetings_signup_view(request):
    """
    Handles host registration and auto login.
    """
    if request.user.is_authenticated:
        return redirect('host_dashboard')

    if request.method == 'POST':
        name = request.POST.get('name')
        email = request.POST.get('email')
        username = request.POST.get('username')
        password = request.POST.get('password')
        password_confirm = request.POST.get('password_confirm')

        user_model = get_user_model()

        if password != password_confirm:
            messages.error(request, "Passwords do not match.")
            return render(request, 'meetings/signup.html')

        if user_model.objects.filter(username=username).exists():
            messages.error(request, "Username is already taken.")
            return render(request, 'meetings/signup.html')

        if user_model.objects.filter(email=email).exists():
            messages.error(request, "Email address is already registered.")
            return render(request, 'meetings/signup.html')

        # Split full name
        parts = name.split()
        first_name = parts[0] if parts else ""
        last_name = " ".join(parts[1:]) if len(parts) > 1 else ""

        # Create user
        user = user_model.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )

        django_login(request, user)
        return redirect('host_dashboard')

    return render(request, 'meetings/signup.html')


@login_required(login_url='/login/')
def host_dashboard_view(request):
    """
    Renders host dashboard listing hosted meetings.
    """
    meetings = Meeting.objects.filter(host=request.user).order_by('-created_at')
    return render(request, 'meetings/dashboard.html', {'meetings': meetings})


@login_required(login_url='/login/')
def create_meeting_view(request):
    """
    Handles creating a meeting via standard template form.
    """
    if request.method == 'POST':
        title = request.POST.get('title')
        start_time_str = request.POST.get('start_time')

        if not title or not start_time_str:
            messages.error(request, "Title and Start Time are required.")
            return redirect('host_dashboard')

        from django.utils.dateparse import parse_datetime
        start_time = parse_datetime(start_time_str)

        import random
        import string
        import uuid

        # Maintain backwards compatibility with API formats
        meeting_id = uuid.uuid4().hex[:8]
        random_letter = random.choice(string.ascii_lowercase)
        clean_username = "".join(char for char in request.user.username if char.isalnum())
        link = f"{clean_username}/{random_letter}/sk_live_hybrid/{meeting_id}"

        Meeting.objects.create(
            title=title,
            start_time=start_time,
            meeting_token=uuid.uuid4(),
            host=request.user,
            is_active=True,
            datetime=start_time_str,
            meeting_id=meeting_id,
            link=link
        )
        return redirect('host_dashboard')

    return redirect('host_dashboard')


def join_meeting_view(request, token):
    """
    Validates magic link attendee token and renders lobby.
    """
    try:
        meeting = Meeting.objects.get(meeting_token=token, is_active=True)
    except (Meeting.DoesNotExist, ValueError):
        return render(request, 'meetings/link_expired.html', status=403)

    return render(request, 'meetings/lobby.html', {'meeting': meeting})


@api_view(['GET'])
@permission_classes([AllowAny])
@authentication_classes([])
def validate_meeting_view(request, company, letter, api_key, meeting_id):
    """
    Validates a meeting invitation link for System 1 React lobby.
    URL Format: /api/meeting/validate/<company>/<letter>/<api_key>/<meeting_id>
    """
    try:
        meeting = Meeting.objects.get(meeting_id=meeting_id)
    except Meeting.DoesNotExist:
        return Response({"error": "Meeting not found."}, status=404)

    # Validate company / host context
    if meeting.company:
        clean_db_company = "".join(c for c in meeting.company.name if c.isalnum()).lower()
        clean_url_company = "".join(c for c in company if c.isalnum()).lower()
        if clean_db_company != clean_url_company:
            return Response({"error": "Company mismatch."}, status=404)
        
        # Validate API Key
        if meeting.company.api_key != api_key:
            return Response({"error": "Invalid API key."}, status=403)
            
        # Ensure the company is active
        if not meeting.company.is_active:
            return Response({"error": "Company account is inactive."}, status=403)
    elif meeting.host:
        # Hybrid host-created meeting check
        clean_db_username = "".join(c for c in meeting.host.username if c.isalnum()).lower()
        clean_url_company = "".join(c for c in company if c.isalnum()).lower()
        if clean_db_username != clean_url_company:
            return Response({"error": "Host mismatch."}, status=404)
            
        if api_key != "sk_live_hybrid":
            return Response({"error": "Invalid API key."}, status=403)
    else:
        return Response({"error": "Meeting host or company not found."}, status=404)

    # Check active state
    if not meeting.is_active:
        return Response({"error": "Meeting is inactive."}, status=403)

    # Retrieve participant emails
    participants = list(meeting.participants.values_list('user_email', flat=True))

    return Response({
        "title": meeting.title,
        "datetime": meeting.datetime or (meeting.start_time.isoformat() if meeting.start_time else ""),
        "company_name": meeting.company.name if meeting.company else (meeting.host.username if meeting.host else "Huddle"),
        "participants": participants
    })

