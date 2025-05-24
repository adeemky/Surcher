from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from django.urls import reverse
from ..models import Survey, Organization, Category, Response


class HasUserRespondedApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(
            email="responded@test.com", username="respondeduser", password="testpass123"
        )
        self.client.force_authenticate(user=self.user)

        self.category = Category.objects.create(name="Check Response")
        self.organization = Organization.objects.create(name="Check Org")

        self.survey = Survey.objects.create(
            title="Survey Check",
            description="Survey to check response",
            category=self.category,
            organization=self.organization,
            deadline="2030-01-01T00:00:00Z",
        )

    def test_has_responded_true(self):
        Response.objects.create(user=self.user, survey=self.survey)

        url = reverse("has-responded", args=[self.survey.id])
        res = self.client.get(url)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data["has_responded"], True)

    def test_has_responded_false(self):
        url = reverse("has-responded", args=[self.survey.id])
        res = self.client.get(url)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data["has_responded"], False)

    def test_has_responded_unauthenticated(self):
        self.client.force_authenticate(user=None)
        url = reverse("has-responded", args=[self.survey.id])
        res = self.client.get(url)

        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)
