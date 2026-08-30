from django.contrib import admin
from .models import Plan, Subscription, Subscription_Payment

admin.site.register(Plan)
admin.site.register(Subscription)
admin.site.register(Subscription_Payment)
