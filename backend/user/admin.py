from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Profile

admin.site.site_header = "Surcher Admin"
admin.site.site_title = "Surcher Admin Panel"
admin.site.index_title = ""
admin.site.site_url = "http://localhost:3000/"


class ProfileInline(admin.TabularInline):
    model = Profile
    can_delete = False
    verbose_name_plural = "Profile"


class CustomUserAdmin(UserAdmin):
    ordering = ["id"]
    inlines = [ProfileInline]

    list_display = [
        "username",
        "id",
        "email",
        "name",
    ]

    fieldsets = (
        ("Credentials", {"fields": ("email", "username", "name", "password")}),
        ("Permissions", {"fields": ("is_staff", "is_superuser", "user_permissions")}),
    )

    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": [
                    "email",
                    "username",
                    "name",
                    "password1",
                    "password2",
                    "is_staff",
                    "is_superuser",
                    "user_permissions",
                ],
            },
        ),
    )


class ProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "age", "gender", "education_level", "marital_status")


admin.site.register(User, CustomUserAdmin)
admin.site.register(Profile, ProfileAdmin)
