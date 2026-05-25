from django.contrib import admin
<<<<<<< HEAD:backend/config/urls.py
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/meetings/', include('modules.meetings.urls')),
]
=======
from django.urls import path,include    

urlpatterns = [
    path('admin/', admin.site.urls), 
    path('api/meetings/', include('apps.meetings.urls')),   
]
>>>>>>> d05637d6c99d3146ebe4a9a4e193d870d781f958:backend/backend/urls.py
