from django.contrib.auth.models import User
from django_filters import rest_framework as django_filters
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .filters import GroupFilterSet, UserFilterSet
from .models import Group, GroupMembership, Message, MessageLike
from .permission import IsAdminUser
from .serializers import (
    GroupDetailSerializer,
    GroupSerializer,
    MessageSerializer,
    UserSerializer,
)



class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    # permission_classes = [permissions.IsAuthenticated]
    filter_backends = [django_filters.DjangoFilterBackend]
    filterset_class = GroupFilterSet

    def get_serializer_class(self):
        if self.action == "retrieve":
            return GroupDetailSerializer
        else:
            return GroupSerializer

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                "name",
                openapi.IN_QUERY,
                description="Name of group",
                type=openapi.TYPE_STRING,
            ),
        ]
    )
    def list(self, request, *args, **kwargs):
        user = request.user
        user = User.objects.first()
        groups = user.chat_groups.all()
        groups = self.filter_queryset(groups)
        serialzers = self.get_serializer(groups, many=True)
        return Response(serialzers.data, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                "name": openapi.Schema(type=openapi.TYPE_STRING),
                "members": openapi.Schema(
                    type=openapi.TYPE_ARRAY,
                    items=openapi.Items(type=openapi.TYPE_INTEGER),
                ),
            },
        )
    )
    def create(self, request, *args, **kwargs):
        members = request.data.get("members", "[]")
        name = request.data.get("name", "")

        members = eval(members)

        if request.user:
            members.append(request.user.id)

        if name and len(members) > 2:
            if Group.objects.filter(name=name).exists():
                return Response(
                    {"error": "Group with same name already exists"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            group = Group.objects.create(name=name)
            users = User.objects.filter(id__in=members)

            group.members.add(*users)
            serialzers = self.get_serializer(group)
            return Response(serialzers.data, status=status.HTTP_201_CREATED)

        return Response(
            {"error": "Name and min. 2 members required"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    @action(detail=True, methods=["POST"], name="add_member")
    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                "member_id": openapi.Schema(
                    type=openapi.TYPE_INTEGER,
                )
            },
        )
    )
    def add_member(self, request, pk, *args, **kwargs):
        """
        Add new member in the existing group
        """
        group_id = pk
        member_id = request.data.get("member_id", None)

        if (
            not Group.objects.filter(id=group_id).exists()
            or not User.objects.filter(id=member_id).exists()
        ):
            return Response(
                {"error": "Group or user not available"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        GroupMembership.objects.create(group_id=group_id, user_id=member_id)
        return Response({"status": "added"}, status=status.HTTP_200_OK)


class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    # permission_classes = [permissions.IsAuthenticated]

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                "group_id",
                openapi.IN_QUERY,
                description="Group id",
                type=openapi.TYPE_INTEGER,
            ),
            openapi.Parameter(
                "receiver_id",
                openapi.IN_QUERY,
                description="Receiver id",
                type=openapi.TYPE_INTEGER,
            ),
        ]
    )
    def list(self, request, *args, **kwargs):
        group_id = request.query_params.get("group_id", None)
        receiver_id = request.query_params.get("receiver_id", None)
        sender_id = request.user.id or 1

        messages = Message.objects.none()
        if group_id:
            messages = Message.objects.filter(group_id=group_id).order_by("-id")
        elif receiver_id and sender_id:
            messages = Message.objects.filter(
                sender_id__in=[receiver_id, sender_id],
                receiver_id__in=[receiver_id, sender_id],
            ).order_by("-id")

        serializer = self.get_serializer(messages, many=True, context={'user_id': sender_id})
        return Response(serializer.data, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                "receiver_id": openapi.Schema(type=openapi.TYPE_INTEGER),
                "group_id": openapi.Schema(
                    type=openapi.TYPE_INTEGER,
                ),
                "content": openapi.Schema(
                    type=openapi.TYPE_STRING,
                ),
            },
        )
    )
    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        # data["sender_id"] = request.user.id
        data["sender_id"] = 1
        if (not "receiver_id" in data) and (not "group_id" in data):
            return Response(
                    {"error": "receiver_id or group_id is mandatory"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    @action(detail=True, methods=["GET"], name="like")
    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                "is_liked",
                openapi.IN_QUERY,
                description="Liked or not",
                type=openapi.TYPE_BOOLEAN,
            )
        ]
    )
    def like(self, request, pk, *args, **kwargs):
        """
        Add new member in the existing group
        """
        message_id = pk
        user_id = request.user.id or 1
        is_liked = request.query_params.get('is_liked', True)

        if (
            not Message.objects.filter(id=message_id).exists()
            or not User.objects.filter(id=user_id).exists()
        ):
            return Response(
                {"error": "Group or user not available"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        like = MessageLike.objects.filter(message_id=message_id, user_id=user_id).last()
        if like:
            like.is_liked = False if is_liked == 'false' else True
            like.save()
        else:
            MessageLike.objects.create(message_id=message_id, user_id=user_id)
        return Response({"status": "added"}, status=status.HTTP_200_OK)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [django_filters.DjangoFilterBackend]
    filterset_class = UserFilterSet

    def get_permissions(self):
        if self.action == "list":
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.IsAuthenticated, IsAdminUser]
        return [permission() for permission in permission_classes]

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                "name",
                openapi.IN_QUERY,
                description="Name of user",
                type=openapi.TYPE_STRING,
            ),
        ]
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
