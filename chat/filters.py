import django_filters

from .models import Group


class GroupFilterSet(django_filters.FilterSet):
    name = django_filters.CharFilter(field_name="name")

    class Meta:
        model = Group
        fields = [
            "name",
        ]
