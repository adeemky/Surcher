from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from survey_api.models import (
    Organization,
    Survey,
    Question,
    Choice,
    Category,
    Response,
    Answer,
)
from user.models import Profile

User = get_user_model()


class Command(BaseCommand):
    help = "Loads demo data for Surcher App"

    def handle(self, *args, **kwargs):
        self.create_categories()
        orgs = self.create_organizations()
        users = self.create_users()
        surveys = self.create_surveys(orgs)
        self.create_responses(users, surveys)
        self.stdout.write(self.style.SUCCESS("Demo data loaded."))

    def create_categories(self):
        categories = [
            "Public Health",
            "Education",
            "Climate Change",
            "Human Rights",
            "Disaster Relief",
            "Gender Equality",
            "Migration",
            "Food Security",
            "Water and Sanitation",
            "Child Protection",
            "Mental Health",
            "Youth Empowerment",
            "Employment",
            "Digital Literacy",
            "Freedom of Speech",
            "Civic Participation",
            "Environmental Justice",
            "Global Development",
            "Animal Welfare",
            "Energy Transition",
        ]
        for name in categories:
            Category.objects.get_or_create(name=name)

    def create_organizations(self):
        data = [
            (
                "Oxfam",
                "Global organization fighting inequality to end poverty and injustice.",
            ),
            (
                "World Wide Fund for Nature",
                "Focused on wilderness preservation and reducing human impact.",
            ),
            ("CARE International", "A global leader dedicated to ending poverty."),
            ("Save the Children", "Promoting children's rights and providing relief."),
            (
                "Amnesty International",
                "Campaigns for a world where human rights are enjoyed by all.",
            ),
            (
                "International Red Cross and Red Crescent Movement",
                "Helps people affected by conflict and disaster.",
            ),
            (
                "Médecins Sans Frontières",
                "Medical aid for people affected by conflict, epidemics or exclusion.",
            ),
            ("Mercy Corps", "Empowering people to recover from crisis."),
            (
                "Plan International",
                "Advancing children's rights and equality for girls.",
            ),
            (
                "Greenpeace",
                "Focusing on environmental issues like deforestation and overfishing.",
            ),
            ("World Health Organization", "Promoting international public health."),
            ("Freedom House", "Research and advocacy on democracy and human rights."),
        ]
        orgs = []
        for name, desc in data:
            org, _ = Organization.objects.get_or_create(
                name=name, definition=name, description=desc
            )
            orgs.append(org)
        return orgs

    def create_users(self):
        users = []
        for i in range(1, 13):
            user = User.objects.create_user(
                username=f"user{i}",
                email=f"user{i}@example.com",
                password="password123",
                name=f"User {i}",
            )
            Profile.objects.create(
                user=user,
                age="18-30" if i % 3 == 0 else "31-45",
                gender="M" if i % 2 == 0 else "F",
                marital_status="S" if i % 2 == 0 else "M",
                education_level="bachelor" if i % 4 == 0 else "high_school",
            )
            users.append(user)
        return users

    def create_surveys(self, orgs):
        category_objs = list(Category.objects.all())
        surveys = []
        for i in range(30):
            org = orgs[i % len(orgs)]
            category = category_objs[i % len(category_objs)]
            survey = Survey.objects.create(
                title=f"{category.name} Community Feedback",
                description=(
                    f"This survey explores public attitudes, behaviors and experiences "
                    f"related to {category.name.lower()}. Conducted in help with "
                    f"{org.name}, the findings will help shape future programs and "
                    f"initiatives in this field."
                ),
                category=category,
                organization=org,
                deadline=timezone.now() + timedelta(days=30),
                is_active=True,
            )
            for j in range(3):
                q = Question.objects.create(
                    survey=survey,
                    text=f"Question {j+1} about {category.name.lower()}?",
                    question_type="single_choice" if j % 2 == 0 else "multiple_choice",
                )
                for k in range(4):
                    Choice.objects.create(
                        question=q, text=f"Option {k+1} for question {j+1}"
                    )
            surveys.append(survey)
        return surveys

    def create_responses(self, users, surveys):
        for i, user in enumerate(users):
            for j, survey in enumerate(surveys):
                if (i + j) % 3 == 0:
                    response = Response.objects.create(user=user, survey=survey)
                    for q in survey.questions.all():
                        if (i + q.id) % 4 == 0:
                            continue
                        answer = Answer.objects.create(response=response, question=q)
                        choices = list(q.choices.all())
                        if q.question_type == "single_choice":
                            answer.choices.set([choices[0]])
                        else:
                            answer.choices.set(choices[:2])

        for survey in surveys[: len(surveys) // 2]:
            survey.is_active = False
            survey.save()
