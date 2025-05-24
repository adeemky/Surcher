from django.test import TestCase
from rest_framework.test import APIClient
from django.urls import reverse
from django.utils.timezone import make_aware
from datetime import datetime
from user.models import User, Profile
from survey_api.models import (
    Survey,
    Organization,
    Category,
    Question,
    Choice,
    Response,
    Answer,
)
from rest_framework import status

SURVEY_RESULT_LIST_URL = reverse("survey-result-list")


def detail_url(survey_id):
    return reverse("survey-result-detail", args=[survey_id])


def create_user(**params):
    user = User.objects.create_user(
        username=params.get("username", "testuser"),
        email=params.get("email", "user@example.com"),
        password=params.get("password", "password123"),
        name=params.get("name", "Test User"),
    )
    Profile.objects.create(
        user=user,
        age="18-30",
        gender="M",
        marital_status="S",
        education_level="high_school",
    )
    return user


def create_survey(is_active=False):
    category, _ = Category.objects.get_or_create(name="Health")
    organization, _ = Organization.objects.get_or_create(name="Health Org")
    survey = Survey.objects.create(
        title="Health Survey",
        description="A survey on health.",
        category=category,
        organization=organization,
        deadline=make_aware(datetime(2024, 12, 31, 23, 59)),
        is_active=is_active,
    )
    question = Question.objects.create(
        survey=survey,
        text="Do you exercise regularly?",
        question_type="multiple_choice",
    )
    choice1 = Choice.objects.create(question=question, text="Yes")
    choice2 = Choice.objects.create(question=question, text="No")
    return survey, question, [choice1, choice2]


class SurveyResultApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = create_user()
        self.client.force_authenticate(self.user)
        self.survey, self.question, self.choices = create_survey(is_active=False)

    def test_list_survey_results_success(self):
        res = self.client.get(SURVEY_RESULT_LIST_URL)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 1)
        self.assertEqual(res.data[0]["title"], self.survey.title)

    def test_retrieve_survey_result_success(self):
        response = Response.objects.create(user=self.user, survey=self.survey)
        answer = Answer.objects.create(response=response, question=self.question)
        answer.choices.set([self.choices[0]])

        res = self.client.get(detail_url(self.survey.id))
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data["title"], self.survey.title)

    def test_list_only_inactive_surveys(self):
        active_survey, _, _ = create_survey(is_active=True)
        res = self.client.get(SURVEY_RESULT_LIST_URL)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 1)
        self.assertEqual(res.data[0]["id"], self.survey.id)

    def test_survey_result_detail_contains_demographics(self):
        response = Response.objects.create(user=self.user, survey=self.survey)
        answer = Answer.objects.create(response=response, question=self.question)
        answer.choices.set([self.choices[0]])

        res = self.client.get(detail_url(self.survey.id))
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn("demographics", res.data)
        self.assertIn("age_distribution", res.data["demographics"])

    def test_survey_result_detail_demographic_counts(self):
        response = Response.objects.create(user=self.user, survey=self.survey)
        answer = Answer.objects.create(response=response, question=self.question)
        answer.choices.set([self.choices[0]])

        res = self.client.get(detail_url(self.survey.id))

        self.assertEqual(res.status_code, status.HTTP_200_OK)

        demographics = res.data["demographics"]

        self.assertEqual(
            demographics["age_distribution"],
            [{"user__profile__age": "18-30", "count": 1}],
        )
        self.assertEqual(
            demographics["gender_distribution"],
            [{"user__profile__gender": "M", "count": 1}],
        )
        self.assertEqual(
            demographics["marital_status_distribution"],
            [{"user__profile__marital_status": "S", "count": 1}],
        )
        self.assertEqual(
            demographics["education_level_distribution"],
            [{"user__profile__education_level": "high_school", "count": 1}],
        )

    def test_create_survey_result_fails(self):
        payload = {"title": "New Survey"}
        res = self.client.post(SURVEY_RESULT_LIST_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_update_survey_result_fails(self):
        payload = {"title": "Updated Survey"}

        res = self.client.patch(detail_url(self.survey.id), payload)
        self.assertEqual(res.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_delete_survey_result_fails(self):
        res = self.client.delete(detail_url(self.survey.id))
        self.assertEqual(res.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_list_survey_result_unauthenticated_fails(self):
        self.client.force_authenticate(user=None)
        res = self.client.get(SURVEY_RESULT_LIST_URL)
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_retrieve_survey_result_unauthenticated_fails(self):
        self.client.force_authenticate(user=None)

        res = self.client.get(detail_url(self.survey.id))
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_survey_result_contains_related_questions_and_choices(self):
        response = Response.objects.create(user=self.user, survey=self.survey)
        answer = Answer.objects.create(response=response, question=self.question)
        answer.choices.set([self.choices[0]])

        res = self.client.get(detail_url(self.survey.id))
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        questions = res.data["questions"]
        self.assertEqual(len(questions), 1)
        self.assertEqual(questions[0]["text"], self.question.text)
        self.assertEqual(len(questions[0]["choices"]), 2)

    def test_total_participants_count_is_correct_and_integer(self):
        Response.objects.create(user=self.user, survey=self.survey)

        user2 = create_user(username="user2", email="user2@example.com")
        Response.objects.create(user=user2, survey=self.survey)

        res = self.client.get(detail_url(self.survey.id))
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        total_participants = res.data["total_participants"]
        self.assertIsInstance(total_participants, int)
        self.assertEqual(total_participants, 2)

    def test_unanswered_count_is_correct(self):
        Response.objects.create(user=self.user, survey=self.survey)

        user2 = create_user(username="user2", email="user2@example.com")
        response2 = Response.objects.create(user=user2, survey=self.survey)
        answer = Answer.objects.create(response=response2, question=self.question)
        answer.choices.set([self.choices[0]])

        res = self.client.get(detail_url(self.survey.id))
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        questions = res.data["questions"]
        self.assertEqual(len(questions), 1)
        self.assertEqual(questions[0]["unanswered_count"], 1)

    def test_survey_result_number_of_questions_is_correct(self):
        res = self.client.get(detail_url(self.survey.id))
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        number_of_questions = res.data["number_of_questions"]
        self.assertIsInstance(number_of_questions, int)
        self.assertEqual(number_of_questions, 1)
