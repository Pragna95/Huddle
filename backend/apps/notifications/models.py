import uuid
from django.db import models
from apps.users.models import User, Product

class AuditLog(models.Model):
    id            = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product       = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="audit_logs")
    actor_user    = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="audit_logs")
    action        = models.CharField(max_length=255)
    resource_type = models.CharField(max_length=100, blank=True, null=True)
    resource_id   = models.UUIDField(blank=True, null=True)
    metadata      = models.JSONField(blank=True, null=True)
    created_at    = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table  = "audit_logs"
        ordering  = ["-created_at"]
