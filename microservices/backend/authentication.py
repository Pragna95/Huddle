from rest_framework import authentication

class ApiKeyAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        return None
