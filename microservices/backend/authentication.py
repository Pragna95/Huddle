from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from apps.meetings.models import ApiKey

class APIKeyAuthentication(BaseAuthentication):
    """
    Custom DRF Authentication class that validates the 'X-API-Key' header
    against the database ApiKey records.
    """
    def authenticate(self, request):
        api_key = request.headers.get('X-API-Key')
        
        # Fallback to query param if not in headers
        if not api_key:
            api_key = request.GET.get('api_key')
            
        if not api_key:
            return None
            
        try:
            key_obj = ApiKey.objects.select_related('host').get(key=api_key, is_active=True)
            if not key_obj.host.is_active:
                raise AuthenticationFailed("Host account is inactive.")
            return (key_obj.host, key_obj)
        except ApiKey.DoesNotExist:
            raise AuthenticationFailed("Invalid or inactive API Key.")
