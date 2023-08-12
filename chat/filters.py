import django_filters
from django.contrib.auth.models import User
from django.db.models import Q

from .models import Group


class GroupFilterSet(django_filters.FilterSet):
    name = django_filters.CharFilter(field_name="name", lookup_expr='contains')

    class Meta:
        model = Group
        fields = [
            "name",
        ]


class UserFilterSet(django_filters.FilterSet):
    name = django_filters.CharFilter(method="filter_name")

    class Meta:
        model = User
        fields = [
            "name",
        ]

    def filter_name(self, queryset, name, value):
        print(name,  value, "filter")
        for term in value.split(" "):
            queryset = queryset.filter(
                Q(first_name__icontains=term) | Q(last_name__icontains=term)
            )
        return queryset
