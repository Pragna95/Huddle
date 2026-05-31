"""
<<<<<<< HEAD
ASGI config for backend project.
=======
ASGI config for config project.
>>>>>>> Team-B

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/asgi/
"""

import os

<<<<<<< HEAD
from channels.routing import ProtocolTypeRouter
=======
>>>>>>> Team-B
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

<<<<<<< HEAD
django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter({
    "http": django_asgi_app,
})
=======
application = get_asgi_application()
>>>>>>> Team-B
