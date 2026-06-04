from channels.routing import (
    URLRouter
)

from apps.meetings.routing import (
    websocket_urlpatterns
)

application = URLRouter(
    websocket_urlpatterns
)