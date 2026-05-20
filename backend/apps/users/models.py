import uuid
from django.db import models

class Product(models.Model):
    id          = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name        = models.CharField(max_length=255)
    slug        = models.SlugField(unique=True)
    status      = models.CharField(max_length=50)
    webhook_url = models.TextField(blank=True, null=True)
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "products"

class ProductApiKey(models.Model):
    id           = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product      = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="api_keys")
    api_key_hash = models.TextField()
    environment  = models.CharField(max_length=50, blank=True, null=True)
    rate_limit   = models.IntegerField(blank=True, null=True)
    is_active    = models.BooleanField(default=True)
    expires_at   = models.DateTimeField(blank=True, null=True)
    last_used_at = models.DateTimeField(blank=True, null=True)
    created_at   = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "product_api_keys"

class User(models.Model):
    id               = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product          = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="users")
    external_user_id = models.CharField(max_length=255, blank=True, null=True)
    email            = models.EmailField(blank=True, null=True)
    name             = models.CharField(max_length=255, blank=True, null=True)
    avatar_url       = models.TextField(blank=True, null=True)
    role             = models.CharField(max_length=50, blank=True, null=True)
    metadata         = models.JSONField(blank=True, null=True)
    is_active        = models.BooleanField(default=True)
    created_at       = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "users"