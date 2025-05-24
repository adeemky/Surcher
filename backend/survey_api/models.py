from django.db import models
from django.contrib.auth import get_user_model


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class Organization(models.Model):
    name = models.CharField(max_length=255)
    definition = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True)
    website = models.URLField(blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    image = models.ImageField(upload_to="organizations/", blank=True, null=True)

    def __str__(self):
        return self.name


class Survey(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    category = models.ForeignKey(
        Category, related_name="surveys", on_delete=models.CASCADE
    )
    organization = models.ForeignKey(
        Organization, related_name="surveys", on_delete=models.CASCADE
    )
    created_at = models.DateTimeField(auto_now_add=True)
    deadline = models.DateTimeField(null=False, blank=False)
    is_active = models.BooleanField(default=True)
    image = models.ImageField(upload_to="surveys/", blank=True, null=True)

    def __str__(self):
        return self.title


class Question(models.Model):
    SINGLE_CHOICE = "single_choice"
    MULTIPLE_CHOICE = "multiple_choice"

    QUESTION_TYPES = [
        (SINGLE_CHOICE, "Single Choice"),
        (MULTIPLE_CHOICE, "Multiple Choice"),
    ]

    survey = models.ForeignKey(
        Survey, related_name="questions", on_delete=models.CASCADE
    )
    text = models.CharField(max_length=500)
    question_type = models.CharField(
        max_length=20, choices=QUESTION_TYPES, default=SINGLE_CHOICE
    )

    def __str__(self):
        return self.text


class Choice(models.Model):
    question = models.ForeignKey(
        Question, related_name="choices", on_delete=models.CASCADE
    )
    text = models.CharField(max_length=255)

    def __str__(self):
        return self.text


class Response(models.Model):
    user = models.ForeignKey(
        get_user_model(),
        related_name="responses",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    survey = models.ForeignKey(
        Survey, related_name="responses", on_delete=models.CASCADE
    )
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Response to {self.survey.title} at {self.submitted_at}"


class Answer(models.Model):
    response = models.ForeignKey(
        Response, related_name="answers", on_delete=models.CASCADE
    )
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    choices = models.ManyToManyField(Choice)

    def __str__(self):
        return f"Answer to {self.question.text}"
