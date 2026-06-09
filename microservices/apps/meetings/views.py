import secrets
import time
import datetime
import random
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

from backend.authentication import ApiKeyAuthentication, JWTCompanyAuthentication, AppApiKeyAuthentication
from backend.permissions import IsCompanyUser
from backend.jwt_utils import encode_jwt
from .models import Company, Meeting, Participant, SuperAdmin, Host, ApiKey, Application

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
@authentication_classes([ApiKeyAuthentication, AppApiKeyAuthentication, JWTCompanyAuthentication])
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


def generate_meeting_link(company_name, api_key, meeting_id):
    clean_company_name = "".join(char for char in company_name if char.isalnum())
    random_letter = random.choice('abcdefghijklmnopqrstuvwxyz')
    return f"{clean_company_name}/{random_letter}/{api_key}/{meeting_id}"


def schedule_meeting_view(request):
    """
    POST /api/schedule-meeting endpoint:
    Supports both:
    - JWT authentication (company logged in via company_login_view)
    - API_KEY authentication (x-api-key header from app1/app2 backend .env)
    
    a. Validate API_KEY or JWT
    b. Use company.name slug and company.api_key
    c. Use DB meeting UUID as meeting_id
    d. Build meeting link exactly: {company_name}/{letter}/{api_key}/{meeting_id}
    e. Save meeting link to DB and cache key meeting:{id}
    f. Send email to all participants with full join link via SMTP
    g. Return JSON: {success: true, meeting_id, link}
    """
    from django.core.mail import send_mail
    from django.http import JsonResponse

    if request.method != 'POST':
        return JsonResponse({"error": "Method not allowed"}, status=405)

    # Extract API_KEY from header
    api_key = request.headers.get('x-api-key') or request.META.get('HTTP_X_API_KEY')
    
    company = None
    user = request.user

    # Try API_KEY authentication first
    if api_key and api_key.startswith('SK_'):
        try:
            company = Company.objects.get(api_key=api_key, is_active=True)
        except Company.DoesNotExist:
            return JsonResponse({"error": "Invalid API key"}, status=401)
    # Fall back to JWT/session authentication
    elif isinstance(user, Company):
        company = user
    elif hasattr(user, 'company') and user.company:
        company = user.company

    if not company:
        return JsonResponse({"error": "Authentication required. Provide x-api-key header or JWT token."}, status=401)

    # Extract request data
    try:
        if request.content_type == 'application/json':
            import json
            data = json.loads(request.body)
        else:
            data = request.POST
    except:
        data = request.POST

    title = data.get('title', '')
    datetime_val = data.get('datetime', '')
    participant_emails = data.get('participant_emails', [])

    # Validate required fields
    if not title:
        return JsonResponse({"error": "Title is required."}, status=400)
    if not datetime_val:
        return JsonResponse({"error": "Datetime is required."}, status=400)

    # Create meeting
    meeting = Meeting.objects.create(
        title=title,
        datetime=datetime_val,
        company=company
    )

    # Generate meeting_id and link
    meeting_id = str(meeting.id)
    link = generate_meeting_link(company.name, company.api_key, meeting_id)
    
    meeting.meeting_id = meeting_id
    meeting.link = link
    meeting.save(update_fields=['meeting_id', 'link'])

    # Create participants
    if participant_emails:
        if isinstance(participant_emails, str):
            participant_emails = [participant_emails]
        for email in participant_emails:
            if email and email.strip():
                Participant.objects.create(
                    meeting=meeting,
                    user_email=email.strip(),
                    user_id=""
                )

    # Cache meeting data
    try:
        cache.set(f"meeting:{meeting.id}", {
            "meeting_id": meeting_id,
            "company": "".join(char for char in company.name if char.isalnum()),
            "api_key": company.api_key,
            "link": link,
            "title": meeting.title,
            "datetime": meeting.datetime,
            "participants": [email.strip() for email in participant_emails if email] if participant_emails else [],
        }, timeout=86400 * 7)  # Cache for 7 days
    except Exception as e:
        import logging
        logging.getLogger(__name__).warning(f"Cache set failed: {e}")

    # Build full link for email
    origin = request.headers.get('Origin') or request.build_absolute_uri('/').rstrip('/')
    full_link = f"{origin}/{link}".rstrip('/')

    # Send email to participants
    subject = f"Meeting Invitation: {title}"
    body = (
        f"Meeting Title: {title}\n"
        f"Organizer: {company.name}\n"
        f"Date & Time: {datetime_val}\n"
        f"\nJoin Link: {full_link}\n"
    )

    sender_email = getattr(settings, 'EMAIL_HOST_USER', 'noreply@huddle.app')
    
    if participant_emails:
        cleaned_emails = [email.strip() for email in participant_emails if email and email.strip()]
        if cleaned_emails:
            try:
                send_mail(
                    subject,
                    body,
                    sender_email,
                    cleaned_emails,
                    fail_silently=False
                )
            except Exception as e:
                import logging
                logger = logging.getLogger(__name__)
                logger.warning(f"Email delivery failed for {cleaned_emails}: {str(e)}")
                # Still return success even if email fails
                pass

    return JsonResponse({
        "success": True,
        "meeting_id": meeting_id,
        "link": link,
        "full_link": full_link
    }, status=201)


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


@csrf_exempt
def create_meeting_view(request):
    """
    Handles creating a meeting via standard template form or REST API.
    """
    if request.method == 'POST':
        from django.http import JsonResponse
        from backend.jwt_utils import decode_jwt

        # Check if it's an API request (JSON)
        is_json = request.content_type == 'application/json' or 'application/json' in request.headers.get('Accept', '')

        # Authenticate manually for API requests
        user = request.user
        company = None
        if not user.is_authenticated:
            # Try API Key authentication
            api_key = request.META.get('HTTP_X_API_KEY') or request.headers.get('x-api-key')
            if api_key and api_key.startswith('sk_live_'):
                try:
                    company = Company.objects.get(api_key=api_key)
                    user = company
                except Company.DoesNotExist:
                    pass
            
            # Try JWT authentication
            if not company:
                auth_header = request.META.get('HTTP_AUTHORIZATION')
                if auth_header:
                    parts = auth_header.split()
                    if len(parts) == 2 and parts[0].lower() in ['bearer', 'jwt']:
                        payload = decode_jwt(parts[1], settings.SECRET_KEY)
                        if payload:
                            try:
                                company = Company.objects.get(id=payload.get("company_id"))
                                user = company
                            except Company.DoesNotExist:
                                pass

        if not user.is_authenticated:
            if is_json:
                return JsonResponse({"error": "Authentication credentials were not provided."}, status=401)
            return redirect('/login/')

        # Extract parameters
        if is_json:
            import json
            try:
                data = json.loads(request.body)
            except Exception:
                data = {}
            title = data.get('title')
            start_time_str = data.get('datetime') or data.get('start_time')
            participant_emails = data.get('participant_emails', [])
        else:
            title = request.POST.get('title')
            start_time_str = request.POST.get('start_time')
            participant_emails = request.POST.getlist('participant_emails')

        if not title:
            if is_json:
                return JsonResponse({"error": "Title is required."}, status=400)
            messages.error(request, "Title is required.")
            return redirect('host_dashboard')

        if not start_time_str:
            if is_json:
                return JsonResponse({"error": "Datetime/Start Time is required."}, status=400)
            messages.error(request, "Start Time is required.")
            return redirect('host_dashboard')

        from django.utils.dateparse import parse_datetime
        start_time = parse_datetime(start_time_str)

        # Identify company
        if hasattr(user, 'company') and user.company:
            company = user.company
        elif isinstance(user, Company):
            company = user
        else:
            company = Company.objects.filter(is_active=True).first()

        company_name = company.name if company else "Huddle"

        import random
        import uuid

        # Create meeting first so we can use the DB UUID as meeting_id
        meeting = Meeting.objects.create(
            title=title,
            datetime=start_time_str,
            start_time=start_time,
            company=company,
            host=user if not isinstance(user, Company) else None,
            is_active=True,
            meeting_token=uuid.uuid4()
        )

        meeting_id = str(meeting.id)
        link = generate_meeting_link(company_name, company.api_key, meeting_id)

        meeting.meeting_id = meeting_id
        meeting.link = link
        meeting.save(update_fields=['meeting_id', 'link'])

        # Save participants
        if participant_emails:
            if isinstance(participant_emails, str):
                participant_emails = [participant_emails]
            for email in participant_emails:
                if email:
                    Participant.objects.create(
                        meeting=meeting,
                        user_email=email,
                        user_id=""
                    )

        # Store meeting data in Redis cache/ Django cache backend for legacy flow as well
        try:
            cache.set(f"meeting:{meeting.id}", {
                "meeting_id": meeting_id,
                "company": "".join(char for char in company_name if char.isalnum()),
                "api_key": company.api_key,
                "link": link,
                "title": meeting.title,
                "datetime": meeting.datetime,
                "participants": [email for email in participant_emails] if participant_emails else [],
            })
        except Exception:
            pass

        # Send email notifications
        subject = f"Meeting Invitation: {title}"
        body = (
            f"Meeting Title: {title}\n"
            f"Organizer Name: {company_name}\n"
            f"Date & Time: {start_time_str}\n"
            f"Join Link: http://localhost:5173/{link}"
        )

        origin = request.headers.get('Origin') or request.build_absolute_uri('/').rstrip('/')
        full_link = f"{origin}/{link}".rstrip('/')
        body = (
            f"Meeting Title: {title}\n"
            f"Organizer Name: {company_name}\n"
            f"Date & Time: {start_time_str}\n"
            f"Join Link: {full_link}"
        )

        sender_email = getattr(settings, 'EMAIL_HOST_USER', 'webmaster@localhost')
        if participant_emails:
            from django.core.mail import send_mail
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

        if is_json:
            return JsonResponse({
                "success": True,
                "meeting_id": meeting_id,
                "link": link
            })
        
        return redirect('host_dashboard')

    if not request.user.is_authenticated:
        return redirect('/login/')
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
        # Check ApiKey model first or fall back to company.api_key
        has_matching_key = False
        if ApiKey.objects.filter(company=meeting.company, key=api_key, is_active=True).exists():
            has_matching_key = True
        elif meeting.company.api_key == api_key:
            has_matching_key = True

        if not has_matching_key:
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

    # Verify schedule (future check and duration link expiration)
    if meeting.datetime:
        try:
            from django.utils.dateparse import parse_datetime
            mtg_dt = parse_datetime(meeting.datetime.split('+')[0])
            if mtg_dt:
                from django.utils.timezone import is_aware, make_aware
                now_dt = tz_now()
                if not is_aware(mtg_dt):
                    mtg_dt = make_aware(mtg_dt)
                # If meeting scheduled start was more than 24 hours ago, reject as expired
                if now_dt > mtg_dt + datetime.timedelta(hours=24):
                    return Response({"error": "Meeting link has expired."}, status=403)
        except Exception:
            pass

    # Retrieve participant emails
    participants = list(meeting.participants.values_list('user_email', flat=True))

    return Response({
        "title": meeting.title,
        "datetime": meeting.datetime or (meeting.start_time.isoformat() if meeting.start_time else ""),
        "company_name": meeting.company.name if meeting.company else (meeting.host.username if meeting.host else "Huddle"),
        "participants": participants
    })


def super_admin_dashboard_view(request):
    """
    Super Admin Dashboard view inside microservices backend.
    """
    if not request.user.is_authenticated or not request.user.is_superuser:
        return redirect('/admin/login/?next=/super-admin/dashboard/')

    super_admin, _ = SuperAdmin.objects.get_or_create(user=request.user)

    if request.method == 'POST':
        action = request.POST.get('action')
        if action == 'create_host':
            name = request.POST.get('name')
            email = request.POST.get('email')
            password = request.POST.get('password')

            if not name or not email or not password:
                messages.error(request, "All fields are required to create a Host.")
            elif Host.objects.filter(email=email).exists():
                messages.error(request, f"Host with email {email} already exists.")
            else:
                Host.objects.create(
                    name=name,
                    email=email,
                    password=password,
                    super_admin=super_admin
                )
                messages.success(request, f"Host account for {name} has been successfully created.")
        
        elif action == 'toggle_status':
            host_id = request.POST.get('host_id')
            try:
                host = Host.objects.get(id=host_id)
                host.is_active = not host.is_active
                host.save()

                # Toggle associated companies and meetings
                companies = Company.objects.filter(host=host)
                for c in companies:
                    c.is_active = host.is_active
                    c.save()
                    Meeting.objects.filter(company=c).update(is_active=host.is_active)

                messages.success(request, f"Host {host.name} status has been updated to {'Active' if host.is_active else 'Inactive'}.")
            except Host.DoesNotExist:
                messages.error(request, "Host not found.")

        return redirect('super_admin_dashboard')

    hosts = Host.objects.all().order_by('-created_at')
    meetings = Meeting.objects.all().order_by('-created_at')
    return render(request, 'super_admin/dashboard.html', {
        'hosts': hosts,
        'meetings': meetings
    })


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
@authentication_classes([])
@csrf_exempt
def company_register_view(request):
    """
    Company Registration Portal for Hosts.
    """
    if request.method == 'GET':
        return render(request, 'company/register.html')

    name = request.data.get('name')
    email = request.data.get('email')
    address = request.data.get('address')
    contact_number = request.data.get('contact_number')
    domain = request.data.get('domain', '')
    password = request.data.get('password')

    if not name or not email or not address or not contact_number or not password:
        return Response({"error": "All fields (except domain) must be provided manually."}, status=400)

    # Check if Host is created by Super Admin and active
    host = Host.objects.filter(email=email, is_active=True).first()
    if not host:
        return Response({"error": "No active Host account found with this email. Please contact the Super Admin to create a Host first."}, status=400)

    # Prevent duplicate company registration
    if Company.objects.filter(email=email).exists():
        return Response({"error": "A company with this email address has already been registered."}, status=400)

    # Create company
    company = Company.objects.create(
        host=host,
        name=name,
        email=email,
        address=address,
        contact_number=contact_number,
        domain=domain,
        password=password,
        is_active=True
    )

    # Generate ApiKey
    new_key = f"sk_live_{secrets.token_hex(16)}"
    ApiKey.objects.create(company=company, key=new_key, is_active=True)

    # Backwards compatibility key cache
    company.api_key = new_key
    company.api_key_created_at = tz_now()
    company.save()

    return Response({
        "success": True,
        "api_key": new_key
    }, status=201)


@api_view(['GET'])
@authentication_classes([ApiKeyAuthentication])
@permission_classes([IsAuthenticated])
def verify_key_view(request):
    """
    Verification endpoint for app backends to validate host identity.
    """
    return Response({
        "valid": True,
        "company": {
            "id": str(request.company.id),
            "name": request.company.name,
            "email": request.company.email,
            "is_active": request.company.is_active
        }
    })

