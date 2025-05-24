from rest_framework import serializers
from django.contrib.auth import get_user_model
from user.models import Profile
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError


class RegisterSerializer(serializers.ModelSerializer):
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
        ("phd", "Doctorate (PhD)"),
    ]

    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required=True)
    age = serializers.ChoiceField(choices=AGE_CHOICES, required=False)
    gender = serializers.ChoiceField(choices=GENDER_CHOICES, required=False)
    marital_status = serializers.ChoiceField(
        choices=MARITAL_STATUS_CHOICES, required=False
    )
    education_level = serializers.ChoiceField(
        choices=EDUCATION_LEVEL_CHOICES, required=False
    )

    class Meta:
        model = get_user_model()
        fields = (
            "username",
            "email",
            "name",
            "password",
            "password2",
            "age",
            "gender",
            "marital_status",
            "education_level",
        )

    def validate(self, attrs):
        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError({"password": "Passwords do not match."})

        try:
            validate_password(attrs["password"])
        except DjangoValidationError as e:
            raise serializers.ValidationError({"password": e.messages})

        return attrs

    def create(self, validated_data):
        password = validated_data.pop("password")
        validated_data.pop("password2")

        profile_data = {
            "age": validated_data.pop("age", None),
            "gender": validated_data.pop("gender", None),
            "marital_status": validated_data.pop("marital_status", None),
            "education_level": validated_data.pop("education_level", None),
        }

        user = get_user_model().objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=password,
            name=validated_data.get("name", ""),
        )

        Profile.objects.create(user=user, **profile_data)
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["username"] = user.username
        token["name"] = user.name
        return token
