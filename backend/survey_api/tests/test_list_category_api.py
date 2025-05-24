from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from django.urls import reverse
from ..models import Category, Organization, Survey


class CategoryListApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(
            email="category@test.com", username="categoryuser", password="testpass123"
        )
        self.client.force_authenticate(user=self.user)

        self.category1 = Category.objects.create(name="Environment")
        self.category2 = Category.objects.create(name="Health")
        self.category_unused = Category.objects.create(name="Unused")

        self.organization = Organization.objects.create(name="OrgCat")

        Survey.objects.create(
            title="Survey A",
            description="Survey on Environment",
            category=self.category1,
            organization=self.organization,
            deadline="2030-01-01T00:00:00Z",
        )

        Survey.objects.create(
            title="Survey B",
            description="Survey on Health",
            category=self.category2,
            organization=self.organization,
            deadline="2030-01-01T00:00:00Z",
        )

    def test_list_categories_returns_used_only(self):
        res = self.client.get(reverse("category-list"))

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn("Environment", res.data)
        self.assertIn("Health", res.data)
        self.assertNotIn("Unused", res.data)

    def test_list_categories_unauthenticated_user_fails(self):
        self.client.force_authenticate(user=None)
        res = self.client.get(reverse("category-list"))

        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)
