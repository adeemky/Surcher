from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    SurveyViewSet,
    ResponseCreateAPIView,
    OrganizationViewSet,
    SurveyResultViewSet,
    CategoryListAPIView,
    OrganizationNameListAPIView,
    HasUserRespondedAPIView,
)

router = DefaultRouter()
router.register(r"surveys", SurveyViewSet, basename="survey")
router.register("results", SurveyResultViewSet, basename="survey-result")

urlpatterns = [
    path("responses", ResponseCreateAPIView.as_view(), name="create-response"),
    path(
        "organizations/<int:pk>/",
        OrganizationViewSet.as_view(),
        name="organization-detail",
    ),
    path("filters/categories/", CategoryListAPIView.as_view(), name="category-list"),
    path(
        "filters/organizations/",
        OrganizationNameListAPIView.as_view(),
        name="organization-list",
    ),
    path(
        "has-responded/<int:survey_id>/",
        HasUserRespondedAPIView.as_view(),
        name="has-responded",
    ),
    path("", include(router.urls)),
]
