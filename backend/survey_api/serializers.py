from rest_framework import serializers
from .models import Survey, Choice, Question, Response, Answer, Organization
from django.db.models import Count
from rest_framework.exceptions import ValidationError


class SurveySerializerForOrganization(serializers.ModelSerializer):
    category = serializers.CharField(source="category.name", read_only=True)
    number_of_questions = serializers.SerializerMethodField()

    class Meta:
        model = Survey
        fields = [
            "id",
            "title",
            "image",
            "description",
            "is_active",
            "deadline",
            "category",
            "number_of_questions",
        ]

    def get_number_of_questions(self, obj):
        return obj.questions.count()


class OrganizationSerializer(serializers.ModelSerializer):
    active_surveys = serializers.SerializerMethodField()
    inactive_surveys = serializers.SerializerMethodField()
    number_of_active_surveys = serializers.SerializerMethodField()
    number_of_inactive_surveys = serializers.SerializerMethodField()

    class Meta:
        model = Organization
        fields = [
            "id",
            "name",
            "image",
            "definition",
            "description",
            "website",
            "address",
            "email",
            "active_surveys",
            "inactive_surveys",
            "number_of_active_surveys",
            "number_of_inactive_surveys",
        ]

    def get_active_surveys(self, obj):
        active = obj.surveys.filter(is_active=True)
        return SurveySerializerForOrganization(
            active, many=True, context=self.context
        ).data

    def get_inactive_surveys(self, obj):
        inactive = obj.surveys.filter(is_active=False)
        return SurveySerializerForOrganization(
            inactive, many=True, context=self.context
        ).data

    def get_number_of_active_surveys(self, obj):
        return obj.surveys.filter(is_active=True).count()

    def get_number_of_inactive_surveys(self, obj):
        return obj.surveys.filter(is_active=False).count()


class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ["id", "text"]


class QuestionSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ["id", "text", "question_type", "choices"]


class OrganizationSerializerForSurvey(serializers.ModelSerializer):
    number_of_active_surveys = serializers.SerializerMethodField()
    number_of_inactive_surveys = serializers.SerializerMethodField()

    class Meta:
        model = Organization
        fields = [
            "id",
            "name",
            "image",
            "number_of_active_surveys",
            "number_of_inactive_surveys",
        ]

    def get_number_of_active_surveys(self, obj):
        return obj.surveys.filter(is_active=True).count()

    def get_number_of_inactive_surveys(self, obj):
        return obj.surveys.filter(is_active=False).count()


class SurveySerializer(serializers.ModelSerializer):
    category = serializers.CharField(source="category.name", read_only=True)
    organization = OrganizationSerializerForSurvey(read_only=True)
    number_of_questions = serializers.SerializerMethodField()
    total_participants = serializers.SerializerMethodField()

    class Meta:
        model = Survey
        fields = [
            "id",
            "title",
            "description",
            "category",
            "organization",
            "created_at",
            "deadline",
            "is_active",
            "number_of_questions",
            "total_participants",
            "image",
        ]

    def get_number_of_questions(self, obj):
        return obj.questions.count()

    def get_total_participants(self, obj) -> int:
        return obj.responses.count()


class SurveyDetailSerializer(SurveySerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta(SurveySerializer.Meta):
        fields = SurveySerializer.Meta.fields + ["questions"]


class AnswerSerializer(serializers.ModelSerializer):
    choices = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Choice.objects.all(), allow_empty=True
    )

    class Meta:
        model = Answer
        fields = ["question", "choices"]


class ResponseSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True)

    class Meta:
        model = Response
        fields = ["survey", "answers"]

    def create(self, validated_data):
        user = validated_data.get("user")
        survey = validated_data.get("survey")

        if Response.objects.filter(user=user, survey=survey).exists():
            raise ValidationError("You have already responded to this survey.")

        answers_data = validated_data.pop("answers")
        response = Response.objects.create(**validated_data)

        for answer_data in answers_data:
            choices = answer_data.pop("choices")
            answer = Answer.objects.create(response=response, **answer_data)
            answer.choices.set(choices)

        return response


class ChoiceResultSerializer(serializers.ModelSerializer):
    votes = serializers.SerializerMethodField()

    class Meta:
        model = Choice
        fields = ["id", "text", "votes"]

    def get_votes(self, obj) -> int:
        return obj.answer_set.count()


class QuestionResultSerializer(serializers.ModelSerializer):
    choices = ChoiceResultSerializer(many=True, read_only=True)
    unanswered_count = serializers.SerializerMethodField()

    class Meta:
        model = Question
        fields = ["id", "text", "question_type", "choices", "unanswered_count"]

    def get_unanswered_count(self, obj) -> int:
        total_responses = obj.survey.responses.count()
        answered_count = obj.answer_set.values("response_id").distinct().count()
        return total_responses - answered_count


class SurveyResultSerializer(serializers.ModelSerializer):
    category = serializers.CharField(source="category.name", read_only=True)
    organization = OrganizationSerializerForSurvey(read_only=True)
    total_participants = serializers.SerializerMethodField()
    number_of_questions = serializers.SerializerMethodField()

    class Meta:
        model = Survey
        fields = [
            "id",
            "title",
            "description",
            "category",
            "organization",
            "created_at",
            "is_active",
            "number_of_questions",
            "total_participants",
            "image",
        ]

    def get_number_of_questions(self, obj):
        return obj.questions.count()

    def get_total_participants(self, obj) -> int:
        return obj.responses.count()


class SurveyResultDetailSerializer(SurveyResultSerializer):
    questions = QuestionResultSerializer(many=True, read_only=True)
    demographics = serializers.SerializerMethodField()

    class Meta(SurveyResultSerializer.Meta):
        fields = SurveyResultSerializer.Meta.fields + [
            "deadline",
            "questions",
            "demographics",
        ]

    def get_demographics(self, obj):

        responses = obj.responses.all()

        age_data = responses.values("user__profile__age").annotate(count=Count("id"))
        gender_data = responses.values("user__profile__gender").annotate(
            count=Count("id")
        )
        marital_data = responses.values("user__profile__marital_status").annotate(
            count=Count("id")
        )
        education_data = responses.values("user__profile__education_level").annotate(
            count=Count("id")
        )

        return {
            "age_distribution": list(age_data),
            "gender_distribution": list(gender_data),
            "marital_status_distribution": list(marital_data),
            "education_level_distribution": list(education_data),
        }
