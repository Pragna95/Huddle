from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User

from .models import SuperAdmin


@api_view(['POST'])
def super_admin_login(request):

    email = request.data.get("email")
    password = request.data.get("password")

    admin = SuperAdmin.objects.filter(email=email).first()

    if not admin:
        return Response({
            "success": False,
            "message": "Admin not found"
        }, status=400)

    if admin.password != password:
        return Response({
            "success": False,
            "message": "Invalid Password"
        }, status=400)

    user, created = User.objects.get_or_create(
        username=email
    )

    refresh = RefreshToken.for_user(user)

    return Response({
        "success": True,
        "access": str(refresh.access_token),
        "refresh": str(refresh)
    })