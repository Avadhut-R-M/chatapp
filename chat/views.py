from django.contrib.auth.models import User
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .filters import GroupFilterSet
from .models import Group, GroupMembership, Message
from .serializers import GroupDetailSerializer, GroupSerializer, MessageSerializer


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]
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
        groups = user.chat_groups.all()
        groups = self.filterset_class(request.query_params, groups).qs
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

