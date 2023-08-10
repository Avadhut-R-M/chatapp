from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Group, Message


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


class MessageSerializer(serializers.ModelSerializer):
    receiver_id = serializers.IntegerField(
        write_only=True, required=False
    )
    group_id = serializers.IntegerField(
        write_only=True, required=False
    )
    sender_id = serializers.IntegerField(
        required=False
    )

    class Meta:
        model = Message
        fields = ("id", "content", "receiver_id", "group_id", "sender_id")
