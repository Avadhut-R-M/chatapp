from django.contrib import admin
from .models import Group, GroupMembership, Message

admin.site.register(GroupMembership)
admin.site.register(Group)
admin.site.register(Message)
