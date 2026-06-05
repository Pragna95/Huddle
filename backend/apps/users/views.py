from django.http import JsonResponse
from .models import User

def get_users(request):
    users = User.objects.filter(
        is_active=True
    )

    data = []

    for user in users:
        data.append({
            "id": str(user.id),
            "name": user.name,
            "email": user.email,
            "avatar_url": user.avatar_url,
        })

    return JsonResponse(data, safe=False)