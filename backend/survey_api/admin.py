from django.contrib import admin
from .models import Category, Organization, Survey, Question, Choice, Response, Answer


class ChoiceInline(admin.TabularInline):
    model = Choice
    extra = 1


class QuestionAdmin(admin.ModelAdmin):
    inlines = [ChoiceInline]


class SurveyAdmin(admin.ModelAdmin):
    list_display = [
        "title",
        "category",
        "organization",
        "created_at",
        "deadline",
        "is_active",
    ]
    list_filter = ["is_active", "category", "organization"]
    search_fields = ["title"]


class ResponseAdmin(admin.ModelAdmin):
    list_display = ["survey", "user", "submitted_at"]
    list_filter = ["survey"]
    search_fields = ["user__username"]


admin.site.register(Category)
admin.site.register(Organization)
admin.site.register(Survey, SurveyAdmin)
admin.site.register(Question, QuestionAdmin)
admin.site.register(Choice)
admin.site.register(Response, ResponseAdmin)
admin.site.register(Answer)
