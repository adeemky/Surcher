from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from survey_api.models import (
    Survey,
    Question,
    Choice,
    Response,
    Answer,
    Category,
    Organization,
)
from datetime import datetime
from django.utils.timezone import make_aware

CREATE_RESPONSE_URL = reverse("create-response")


def create_survey(**params):
    category, _ = Category.objects.get_or_create(name="Category Name")
    organization, _ = Organization.objects.get_or_create(
        name="Org Name", defaults={"description": "Org Desc"}
    )

    defaults = {
        "title": "Survey Title",
        "description": "Survey Description",
        "category": category,
        "organization": organization,
        "deadline": make_aware(datetime(2025, 12, 31, 23, 59)),
    }

    defaults.update(**params)
    survey = Survey.objects.create(**defaults)

    question = Question.objects.create(
        survey=survey, text="Sample Question?", question_type="multiple_choice"
    )
    choice1 = Choice.objects.create(question=question, text="Choice 1")
    choice2 = Choice.objects.create(question=question, text="Choice 2")

    return survey, question, [choice1, choice2]


class ResponseApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpasspassword",
            name="Test User",
        )
        self.client.force_authenticate(user=self.user)
        self.survey, self.question, self.choices = create_survey()

    def test_submit_response_success(self):
        payload = {
            "survey": self.survey.id,
            "answers": [
                {"question": self.question.id, "choices": [self.choices[0].id]}
            ],
        }
        res = self.client.post(CREATE_RESPONSE_URL, payload, format="json")

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Response.objects.count(), 1)
        self.assertEqual(Answer.objects.count(), 1)
        self.assertEqual(Answer.objects.first().choices.first(), self.choices[0])

    def test_list_response_fails(self):
        res = self.client.get(CREATE_RESPONSE_URL)

        self.assertEqual(res.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_duplicate_response_fails(self):
        payload = {
            "survey": self.survey.id,
            "answers": [
                {"question": self.question.id, "choices": [self.choices[0].id]}
            ],
        }
        self.client.post(CREATE_RESPONSE_URL, payload, format="json")
        res = self.client.post(CREATE_RESPONSE_URL, payload, format="json")

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Response.objects.count(), 1)

    def test_submit_response_unauthenticated_user_fails(self):
        self.client.force_authenticate(user=None)

        payload = {
            "survey": self.survey.id,
            "answers": [
                {"question": self.question.id, "choices": [self.choices[0].id]}
            ],
        }
        res = self.client.post(CREATE_RESPONSE_URL, payload, format="json")

        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)
