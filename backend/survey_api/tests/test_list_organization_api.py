from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from django.urls import reverse
from ..models import Organization, Category, Survey


class OrganizationListApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(
            email="orglist@test.com", username="orguser", password="testpass123"
        )
        self.client.force_authenticate(user=self.user)

        self.category = Category.objects.create(name="TestCat")

        self.organization1 = Organization.objects.create(name="Org A")
        self.organization2 = Organization.objects.create(name="Org B")
        self.organization_unused = Organization.objects.create(name="Org Unused")

        Survey.objects.create(
            title="Survey 1",
            description="Survey 1 Desc",
            category=self.category,
            organization=self.organization1,
            deadline="2030-01-01T00:00:00Z",
        )

        Survey.objects.create(
            title="Survey 2",
            description="Survey 2 Desc",
            category=self.category,
            organization=self.organization2,
            deadline="2030-01-01T00:00:00Z",
        )

    def test_list_organizations_returns_used_only(self):
        res = self.client.get(reverse("organization-list"))

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn("Org A", res.data)
        self.assertIn("Org B", res.data)
        self.assertNotIn("Org Unused", res.data)

    def test_list_organizations_unauthenticated_user_fails(self):
        self.client.force_authenticate(user=None)
        res = self.client.get(reverse("organization-list"))

        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)
