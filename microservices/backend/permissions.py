from rest_framework.permissions import BasePermission

class HasAPIKey(BasePermission):
    """
    Custom DRF Permission class that ensures the request is authenticated via API Key.
    """
    def has_permission(self, request, view):
        # request.user will be populated by APIKeyAuthentication if the key was valid.
        # request.auth will contain the API Key.
        return bool(request.user and request.user.is_authenticated and request.auth)
