
from django.contrib import admin
from .models import SuperAdmin
from .models import Host
# Register your models here.
admin.site.register(SuperAdmin)
admin.site.register(Host)