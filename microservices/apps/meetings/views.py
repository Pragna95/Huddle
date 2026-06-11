import secrets
from django.shortcuts import render, redirect
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views import View
from django.contrib import messages
from django.contrib.auth.hashers import make_password
from urllib.parse import urlencode
from django.contrib.auth.views import LoginView
from django.contrib.auth.forms import UserCreationForm
from django.urls import reverse_lazy
from django.views.generic import CreateView
from .models import *

from django.conf import settings

class CustomLoginView(LoginView):
    template_name = 'auth/login.html'
    redirect_authenticated_user = True # Redirects to dashboard if already logged in
    
    def get_success_url(self):
        # Read the raw 'next' parameter before Django strips it for being cross-domain
        redirect_to = self.request.POST.get(
            self.redirect_field_name, 
            self.request.GET.get(self.redirect_field_name, "")
        )
        print(f"DEBUG CustomLoginView: redirect_to='{redirect_to}', FRONTEND_URL='{settings.FRONTEND_URL}'")
        
        # Explicitly allow redirect to our trusted frontend React app
        if redirect_to and redirect_to.startswith(settings.FRONTEND_URL):
            print(f"DEBUG CustomLoginView: MATCHED frontend url, returning {redirect_to}")
            return redirect_to
            
        url = self.get_redirect_url()
        print(f"DEBUG CustomLoginView: did NOT match, returning get_redirect_url '{url}' or super '{super().get_success_url()}'")
        return url or super().get_success_url()
    
    def form_invalid(self, form):
        messages.error(self.request, "Invalid username or password.")
        return super().form_invalid(form)

class SignupView(CreateView):
    form_class = UserCreationForm
    template_name = 'auth/signup.html'
    success_url = reverse_lazy('login') # On successful signup, navigates to login
    
    def get_success_url(self):
        url = super().get_success_url()
        next_url = self.request.POST.get('next') or self.request.GET.get('next')
        if next_url:
            return f"{url}?{urlencode({'next': next_url})}"
        return url
    
    def form_valid(self, form):
        messages.success(self.request, "Account created successfully! Please log in.")
        return super().form_valid(form)

    def form_invalid(self, form):
        # If user already exists (or passwords don't match), it shows here
        messages.error(self.request, "Could not create account. Please check the errors below.")
        return super().form_invalid(form)

class SuperAdminDashboardView(LoginRequiredMixin, View):
    template_name = 'super_admin/dashboard.html'
    
    def get(self, request, *args, **kwargs):
        # We assume only superusers can access this dashboard
        if not request.user.is_superuser:
            messages.error(request, "You do not have permission to access the dashboard.")
            return redirect('/')
            
        products = Product.objects.all().order_by('-created_at')
        api_keys = ProductApiKey.objects.all().order_by('-created_at')
        
        context = {
            'products': products,
            'api_keys': api_keys,
        }
        return render(request, self.template_name, context)

    def post(self, request, *args, **kwargs):
        if not request.user.is_superuser:
            return redirect('/')
            
        action = request.POST.get('action')
        
        if action == 'create_product':
            name = request.POST.get('name')
            slug = request.POST.get('slug')
            status = request.POST.get('status', 'active')
            webhook_url = request.POST.get('webhook_url', '')
            
            if Product.objects.filter(slug=slug).exists():
                messages.error(request, f"Product with slug '{slug}' already exists.")
            else:
                Product.objects.create(
                    name=name,
                    slug=slug,
                    status=status,
                    webhook_url=webhook_url
                )
                messages.success(request, f"Product '{name}' registered successfully.")
                
        elif action == 'generate_api_key':
            product_id = request.POST.get('product_id')
            environment = request.POST.get('environment', 'development')
            rate_limit = request.POST.get('rate_limit', 1000)
            
            try:
                product = Product.objects.get(id=product_id)
                
                # Generate a secure random string for the API key
                raw_api_key = secrets.token_urlsafe(32)
                
                # Create the API key record
                ProductApiKey.objects.create(
                    product=product,
                    api_key_hash=make_password(raw_api_key),
                    environment=environment,
                    rate_limit=rate_limit,
                    is_active=True
                )
                
                # Important: Show the raw key in a flash message (using the raw-key-box HTML defined in template)
                msg = f"API Key generated for {product.name} ({environment}):<br><br>"
                msg += f"<div class='raw-key-box'>{raw_api_key}</div>"
                msg += "Please copy it now. You will not be able to see it again!"
                messages.success(request, msg)
                
            except Product.DoesNotExist:
                messages.error(request, "Selected product does not exist.")
                
        return redirect('super_admin_dashboard')
