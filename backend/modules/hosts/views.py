from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
from modules.hosts.models import Host

import secrets


@api_view(['POST'])

def create_host(request):

    name = request.data.get("name")
    email = request.data.get("email")
    company_name = request.data.get("company_name")

    api_key = "HOST_" + secrets.token_hex(16)
    print(request.data)
    host = Host.objects.create(
        name=name,
        email=email,
        company_name=company_name,
        
    )

    return Response({
        "success": True,
        "message":"Host Created Successfully",
        "host_id": str(host.id),
        "role": host.role,
        "api_key": str(host.api_key)
    })