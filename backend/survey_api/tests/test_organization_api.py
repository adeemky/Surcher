from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from django.urls import reverse
from ..models import Organization
from PIL import Image
from django.core.files.uploadedfile import SimpleUploadedFile
import io


def create_temp_image(width=10, height=10):
    img = Image.new("RGB", (width, height))
    buffer = io.BytesIO()
    img.save(buffer, format="JPEG")
    buffer.seek(0)
    return SimpleUploadedFile("testorg.jpg", buffer.read(), content_type="image/jpeg")


class OrganizationApiTests(TestCase):
    def setUp(self):

        self.client = APIClient()
        self.user = get_user_model().objects.create_user(
            email="test@user.com", username="testuser", password="testpassword"
        )
        self.client.force_authenticate(user=self.user)
        self.organization = Organization.objects.create(
            name="Test Organization",
            description="Test Description",
            image=create_temp_image(),
        )

    def tearDown(self):
        if self.organization.image:
            self.organization.image.delete(save=False)

    def test_retrieve_organization_success(self):
        res = self.client.get(
            reverse("organization-detail", args=[self.organization.id])
        )

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data["name"], self.organization.name)

    def test_update_organization_fails(self):
        payload = {"name": "Updated Name"}
        res = self.client.patch(
            reverse("organization-detail", args=[self.organization.id]), payload
        )

        self.assertEqual(res.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_delete_organization_fails(self):
        res = self.client.delete(
            reverse("organization-detail", args=[self.organization.id])
        )

        self.assertEqual(res.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_organization_surveys_and_counts(self):
        from ..models import Category

        category = Category.objects.create(name="General")

        self.organization.surveys.create(
            title="Active Survey",
            description="A survey",
            category=category,
            deadline="2030-01-01T00:00:00Z",
            is_active=True,
        )

        self.organization.surveys.create(
            title="Inactive Survey",
            description="A survey",
            category=category,
            deadline="2020-01-01T00:00:00Z",
            is_active=False,
        )

        res = self.client.get(
            reverse("organization-detail", args=[self.organization.id])
        )

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data["number_of_active_surveys"], 1)
        self.assertEqual(res.data["number_of_inactive_surveys"], 1)
        self.assertEqual(len(res.data["active_surveys"]), 1)
        self.assertEqual(len(res.data["inactive_surveys"]), 1)
        self.assertEqual(res.data["active_surveys"][0]["title"], "Active Survey")
        self.assertEqual(res.data["inactive_surveys"][0]["title"], "Inactive Survey")

    def test_retrieve_organization_unauthenticated_user_fails(self):
        self.client.force_authenticate(user=None)

        res = self.client.get(
            reverse("organization-detail", args=[self.organization.id])
        )
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)
