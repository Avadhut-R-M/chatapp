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
    sender_name = serializers.SerializerMethodField()
    time = serializers.DateTimeField(source='created' ,format='%d-%h %I:%M %p', read_only=True)
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = ("id", "content", "receiver_id", "group_id", "sender_id", "sender_name", "time", "is_liked")

    def get_sender_name(self, obj):
        return ' '.join([obj.sender.first_name, obj.sender.last_name])
    
    def get_is_liked(self, obj):
        user_id = self.context.get('user_id', None)
        if obj.messagelike_set.filter(user_id = user_id, is_liked=True).exists():
            return True
        return False


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
