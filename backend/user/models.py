from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)


class UserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not username:
            raise ValueError("Username is required!")
        if not email:
            raise ValueError("E-mail is required!")

        user = self.model(
            username=username, email=self.normalize_email(email), **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        return self.create_user(username, email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    username = models.CharField(unique=True, max_length=99)
    name = models.CharField(max_length=49)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    objects = UserManager()

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["email"]

    def __str__(self):
        return self.name


class Profile(models.Model):
    AGE_CHOICES = [
        ("18-30", "18-30"),
        ("31-45", "31-45"),
        ("46-65", "46-65"),
        ("65+", "65+"),
    ]

    GENDER_CHOICES = [
        ("M", "Male"),
        ("F", "Female"),
    ]

    MARITAL_STATUS_CHOICES = [
        ("S", "Single"),
        ("M", "Married"),
    ]

    EDUCATION_LEVEL_CHOICES = [
        ("primary_school", "Primary School"),
        ("high_school", "High School"),
        ("bachelor", "Bachelor's Degree"),
        ("master", "Master's Degree"),
        ("phd", "PhD"),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    age = models.CharField(max_length=10, choices=AGE_CHOICES, null=True, blank=True)
    gender = models.CharField(
        max_length=20, choices=GENDER_CHOICES, null=True, blank=True
    )
    education_level = models.CharField(
        max_length=20, choices=EDUCATION_LEVEL_CHOICES, null=True, blank=True
    )
    marital_status = models.CharField(
        max_length=20, choices=MARITAL_STATUS_CHOICES, null=True, blank=True
    )

    def __str__(self):
        return f"{self.user.username}'s profile"


# SU ademkaya
