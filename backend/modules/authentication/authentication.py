from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed

from .models import User


class ApiKeyAuthentication(BaseAuthentication):

    def authenticate(self, request):

        api_key = request.headers.get('Authorization')

        if not api_key:
            return None

        try:
            prefix, key = api_key.split(' ')

            if prefix != 'Api-Key':
                raise AuthenticationFailed('Invalid prefix')

        except ValueError:
            raise AuthenticationFailed('Invalid API key format')

        try:
            user = User.objects.get(api_key=key)

        except User.DoesNotExist:
            raise AuthenticationFailed('Invalid API key')

        return (user, None)