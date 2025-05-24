from django.test import TestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from django.urls import reverse
from ..models import Organization, Category, Survey, Choice, Question
from datetime import datetime
from django.utils.timezone import make_aware
from PIL import Image
from django.core.files.uploadedfile import SimpleUploadedFile
import io


def create_temp_image(width=10, height=10):
    img = Image.new("RGB", (width, height))
    buffer = io.BytesIO()
    img.save(buffer, format="JPEG")
    buffer.seek(0)
    return SimpleUploadedFile(
        "testsurvey.jpg", buffer.read(), content_type="image/jpeg"
    )


def create_survey(**params):
    category, _ = Category.objects.get_or_create(name="Category Name")
    organization, _ = Organization.objects.get_or_create(name="Org Name")

    defaults = {
        "title": "Survey Title",
        "description": "Survey Description",
        "category": category,
        "organization": organization,
        "deadline": make_aware(datetime(2025, 12, 31, 23, 59)),
    }

    defaults.update(**params)

    return Survey.objects.create(**defaults)


class SurveyApiTests(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            email="test@user.com", username="testuser", password="testpassword"
        )
        self.client = APIClient()
        self.client.force_authenticate(self.user)
        self.survey = create_survey(image=create_temp_image())

    def tearDown(self):
        self.survey.image.delete()

    def test_list_surveys_success(self):
        res = self.client.get(reverse("survey-list"))
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data[0]["title"], self.survey.title)
        self.assertIn(self.survey.image.name, res.data[0]["image"])

    def test_list_only_active_surveys(self):
        inactive_survey = create_survey(is_active=False, title="Inactive Survey")
        res = self.client.get(reverse("survey-list"))

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        titles = [survey["title"] for survey in res.data]
        self.assertIn(self.survey.title, titles)
        self.assertNotIn(inactive_survey.title, titles)

    from ..models import Question, Choice

    def test_survey_contains_related_questions_and_choices(self):
        question = Question.objects.create(
            survey=self.survey, text="Sample question?", question_type="single"
        )
        Choice.objects.create(question=question, text="Yes")
        Choice.objects.create(question=question, text="No")

        res = self.client.get(reverse("survey-detail", args=[self.survey.id]))

        self.assertIn("questions", res.data)
        self.assertEqual(len(res.data["questions"][0]["choices"]), 2)

    def test_create_survey_fails(self):
        payload = {"name": "New Survey"}
        res = self.client.post(reverse("survey-list"), payload)

        self.assertEqual(res.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_retrieve_survey_success(self):
        res = self.client.get(reverse("survey-detail", args=[self.survey.id]))

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data["title"], self.survey.title)

    def test_update_survey_fails(self):
        payload = {"name": "Updated Name"}
        res = self.client.patch(
            reverse("survey-detail", args=[self.survey.id]), payload
        )

        self.assertEqual(res.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_delete_survey_fails(self):
        res = self.client.delete(reverse("survey-detail", args=[self.survey.id]))

        self.assertEqual(res.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_list_surveys_unauthenticated_user_fails(self):
        self.client.force_authenticate(user=None)

        res = self.client.get(reverse("survey-list"))
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_retrieve_survey_unauthenticated_user_fails(self):
        self.client.force_authenticate(user=None)

        res = self.client.get(reverse("survey-detail", args=[self.survey.id]))
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)
