from django.contrib import admin

from .models import Subscription, Comment, Favourite

admin.site.register(Subscription)
admin.site.register(Comment)
admin.site.register(Favourite)