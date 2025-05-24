from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status


REGISTER_USER_URL = reverse("register")
LOGIN_USER_URL = reverse("token_obtain")


def create_user(**params):
    return get_user_model().objects.create_user(**params)


def generate_user_payload(**overrides):
    payload = {
        "username": "testuser",
        "email": "testuser@email.com",
        "name": "Test User",
        "password": "testuserpass",
        "password2": "testuserpass",
        "age": "18-30",
        "gender": "M",
        "marital_status": "S",
        "education_level": "high_school",
    }
    payload.update(overrides)
    return payload


class UserTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_register_user_success(self):
        payload = generate_user_payload()

        res = self.client.post(REGISTER_USER_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        user = get_user_model().objects.get(username=payload["username"])

        self.assertEqual(res.data["username"], payload["username"])
        self.assertEqual(res.data["email"], payload["email"])
        self.assertEqual(res.data["name"], payload["name"])

        self.assertTrue(user.check_password(payload["password"]))
        self.assertNotIn("password", res.data)

        self.assertEqual(user.profile.age, payload["age"])
        self.assertEqual(user.profile.gender, payload["gender"])
        self.assertEqual(user.profile.marital_status, payload["marital_status"])
        self.assertEqual(user.profile.education_level, payload["education_level"])

    def test_register_user_with_existing_username(self):
        create_user(
            username="testuser",
            email="testuser@email.com",
            name="Test User",
            password="testuserpass",
        )

        payload = generate_user_payload(email="newuser@email.com")

        res = self.client.post(REGISTER_USER_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_user_with_existing_email(self):
        create_user(
            username="testuser",
            email="testuser@email.com",
            name="Test User",
            password="testuserpass",
        )

        payload = generate_user_payload(username="newuser")

        res = self.client.post(REGISTER_USER_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_user_with_missmatched_passwords(self):
        payload = generate_user_payload(
            password="goodpassword", password2="badpassword"
        )

        res = self.client.post(REGISTER_USER_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        user_exists = (
            get_user_model().objects.filter(email=payload["username"]).exists()
        )
        self.assertFalse(user_exists)

    def test_register_user_with_short_password(self):
        payload = generate_user_payload(password="short", password2="short")

        res = self.client.post(REGISTER_USER_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        user_exists = (
            get_user_model().objects.filter(email=payload["username"]).exists()
        )
        self.assertFalse(user_exists)

    def test_login_success(self):
        create_user(
            username="testuser",
            email="testuser@email.com",
            name="Test User",
            password="testuserpass",
        )

        payload = {
            "username": "testuser",
            "password": "testuserpass",
        }

        res = self.client.post(LOGIN_USER_URL, payload)
        self.assertIn("access", res.data)
        self.assertIn("refresh", res.data)
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_login_with_bad_credentials(self):
        create_user(
            username="testuser",
            email="testuser@email.com",
            name="Test User",
            password="goodpassword",
        )

        payload = {
            "username": "testuser",
            "password": "badpassword",
        }

        res = self.client.post(LOGIN_USER_URL, payload)
        self.assertNotIn("access", res.data)
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)
