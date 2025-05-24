from rest_framework import viewsets, generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response as DRFResponse
from rest_framework.views import APIView
from .filters import BaseSurveyFilterMixin
from django.db.models import Count
from .models import Survey, Response, Organization
from .serializers import (
    SurveySerializer,
    SurveyDetailSerializer,
    ResponseSerializer,
    SurveyResultSerializer,
    SurveyResultDetailSerializer,
    OrganizationSerializer,
)


class OrganizationViewSet(generics.RetrieveAPIView):
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer
    permission_classes = [IsAuthenticated]


class SurveyViewSet(BaseSurveyFilterMixin, viewsets.ReadOnlyModelViewSet):
    queryset = Survey.objects.filter(is_active=True).annotate(
        number_of_questions=Count("questions")
    )
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action == "retrieve":
            return SurveyDetailSerializer
        return SurveySerializer


class ResponseCreateAPIView(generics.CreateAPIView):
    queryset = Response.objects.all()
    serializer_class = ResponseSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class SurveyResultViewSet(BaseSurveyFilterMixin, viewsets.ReadOnlyModelViewSet):
    queryset = Survey.objects.filter(is_active=False)
    permission_classes = [IsAuthenticated]
    queryset = Survey.objects.filter(is_active=False).annotate(
        number_of_questions=Count("questions")
    )

    def get_serializer_class(self):
        if self.action == "retrieve":
            return SurveyResultDetailSerializer
        return SurveyResultSerializer


class CategoryListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        categories = Survey.objects.values_list("category__name", flat=True).distinct()
        return DRFResponse(sorted(categories))


class OrganizationNameListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        organizations = Survey.objects.values_list(
            "organization__name", flat=True
        ).distinct()
        return DRFResponse(sorted(organizations))


class HasUserRespondedAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, survey_id):
        has_responded = Response.objects.filter(
            user=request.user, survey_id=survey_id
        ).exists()
        return DRFResponse({"has_responded": has_responded})
