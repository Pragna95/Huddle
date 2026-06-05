from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import get_user_model
from authentication.models import ApiKey

User = get_user_model()

class ApiKeyAuthentication(BaseAuthentication):
    """
    Custom DRF Authentication class that validates the 'X-API-Key' or 'Authorization' header.
    Reads the associated user using X-User-Id or user_id query parameters.
    """
    def authenticate(self, request):
        api_key = request.headers.get('X-API-Key') or request.headers.get('Authorization')
        if api_key and api_key.startswith('Bearer '):
            api_key = api_key[7:]
            
        if not api_key:
            return None
            
        try:
            key_obj = ApiKey.objects.get(key=api_key, is_active=True)
            
            # Find the user requested by user_id or user_email from headers/GET params
            user_id = request.headers.get('X-User-Id') or request.GET.get('user_id')
            user_email = request.headers.get('X-User-Email') or request.GET.get('user_email')
            
            user = None
            if user_id:
                user = User.objects.filter(id=user_id).first()
            elif user_email:
                user = User.objects.filter(email=user_email).first()
                
            if not user:
                # Fallback: if no user is specified, return a generic active system user
                user = User.objects.filter(is_superuser=True).first() or User.objects.filter(is_active=True).first()
                
            return (user, api_key)
        except ApiKey.DoesNotExist:
            raise AuthenticationFailed("Invalid API Key.")
