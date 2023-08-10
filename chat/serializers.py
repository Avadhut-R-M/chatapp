from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Group, GroupMembership, Message


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ("id", "name")


class GroupMemberSerializer(serializers.ModelSerializer):
    is_admin = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ("id", "first_name", "last_name", "email", "is_admin")

    def get_is_admin(self, obj):
        group_id = self.context.get("group_id", None)
        if group_id:
            membership = GroupMembership.objects.filter(
                group_id=group_id, user_id=obj.id
            ).last()
            if membership:
                return membership.is_admin
        return False


class GroupDetailSerializer(GroupSerializer):
    members = serializers.SerializerMethodField()

    class Meta(GroupSerializer.Meta):
        fields = GroupSerializer.Meta.fields + ("members",)

    def get_members(self, obj):
        members = obj.members
        return GroupMemberSerializer(
            members, many=True, context={"group_id": obj.id}
        ).data


class MessageSerializer(serializers.ModelSerializer):
    receiver_id = serializers.IntegerField(write_only=True, required=False)
    group_id = serializers.IntegerField(write_only=True, required=False)
    sender_id = serializers.IntegerField(required=False)

    class Meta:
        model = Message
        fields = ("id", "content", "receiver_id", "group_id", "sender_id")


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ("first_name", "last_name", "email", "username", "password")

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
            first_name=validated_data.get("first_name", ""),
            last_name=validated_data.get("last_name", ""),
        )
        return user
