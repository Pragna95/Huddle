import logging
from django.conf import settings
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed, PermissionDenied
from apps.meetings.models import Company
from .jwt_utils import decode_jwt

logger = logging.getLogger(__name__)

class ApiKeyAuthentication(BaseAuthentication):
    """
    Custom DRF Authentication class that validates the 'HTTP_X_API_KEY' header.
    Sets request.company on success.
    Enforces active check (403 if company is inactive).
    """
    def authenticate(self, request):
        key = request.META.get('HTTP_X_API_KEY')
        if not key:
            key = request.headers.get('x-api-key')
        if not key or not key.startswith('sk_live_'):
            return None

        try:
            company = Company.objects.get(api_key=key)
        except Company.DoesNotExist:
            raise AuthenticationFailed("Invalid API key")

        if not company.is_active:
            raise PermissionDenied("Company account is inactive.")

        # Set request.company for down-stream view filtering
        request.company = company

        # Never log full key. Log only last 4 chars
        masked_key = f"sk_live_***{key[-4:]}"
        logger.info(f"API Key authentication success. Key: {masked_key}")

        # Return (user, auth) tuple required by DRF
        return (company, key)


class AppApiKeyAuthentication(BaseAuthentication):
    """
    Accepts app1_sk_* and app2_sk_* API keys issued to users by the auth service.
    Maps to the first active Company as the scheduling tenant.
    """
    APP_KEY_PREFIXES = ('app1_sk_', 'app2_sk_')

    def authenticate(self, request):
        key = request.META.get('HTTP_X_API_KEY')
        if not key:
            key = request.headers.get('x-api-key')
        if not key:
            return None

        # Accept any app-level key (not company sk_live_ keys)
        if not any(key.startswith(prefix) for prefix in self.APP_KEY_PREFIXES):
            return None

        # Map to first active company as the scheduling tenant
        company = Company.objects.filter(is_active=True).first()
        if not company:
            raise AuthenticationFailed("No active company found for this API key.")

        request.company = company
        logger.info(f"App API Key authentication success for company: {company.name}")
        return (company, key)


class JWTCompanyAuthentication(BaseAuthentication):
    """
    Custom DRF Authentication class for company dashboard actions.
    Validates standard Bearer JWT tokens.
    """
    def authenticate(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        if not auth_header:
            return None

        parts = auth_header.split()
        if len(parts) != 2:
            return None

        auth_type, token = parts
        if auth_type.lower() not in ['bearer', 'jwt']:
            return None

        payload = decode_jwt(token, settings.SECRET_KEY)
        if not payload:
            raise AuthenticationFailed("Invalid or expired JWT")

        company_id = payload.get("company_id")
        try:
            company = Company.objects.get(id=company_id)
        except Company.DoesNotExist:
            raise AuthenticationFailed("Company not found")

        if not company.is_active:
            raise PermissionDenied("Company account is inactive.")

        return (company, token)

