from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
import django_filters
from .models import Survey


class SurveyFilterSet(django_filters.FilterSet):
    category__name = django_filters.CharFilter(
        field_name="category__name", lookup_expr="iexact"
    )
    organization__name = django_filters.CharFilter(
        field_name="organization__name", lookup_expr="iexact"
    )

    class Meta:
        model = Survey
        fields = ["category__name", "organization__name"]


class BaseSurveyFilterMixin:
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_class = SurveyFilterSet
    ordering_fields = ["created_at", "number_of_questions"]
