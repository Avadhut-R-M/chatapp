from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Group


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ("id", "name")


class GroupMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "first_name", "last_name", "email")


class GroupDetailSerializer(GroupSerializer):
    members = GroupMemberSerializer(many=True)

    class Meta(GroupSerializer.Meta):
        fields = GroupSerializer.Meta.fields + ("members",)
