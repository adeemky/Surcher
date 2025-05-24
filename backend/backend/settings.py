from pathlib import Path
import os
import environ
from datetime import timedelta
from configurations import Configuration, values


env = environ.Env()
environ.Env.read_env()

environ.Env.read_env(env_file=str(Path(__file__).resolve().parent.parent / ".env"))


class Dev(Configuration):
    # Build paths inside the project like this: BASE_DIR / 'subdir'.
    BASE_DIR = Path(__file__).resolve().parent.parent

    # Quick-start development settings - unsuitable for production
    # See https://docs.djangoproject.com/en/5.1/howto/deployment/checklist/

    # SECURITY WARNING: keep the secret key used in production secret!
    SECRET_KEY = env("SECRET_KEY")

    # SECURITY WARNING: don't run with debug turned on in production!
    DEBUG = values.BooleanValue(env.bool("DEBUG", default=True))

    ALLOWED_HOSTS = env.list("ALLOWED_HOSTS", default=["*"])

    # Application definition

    INSTALLED_APPS = [
        "django.contrib.admin",
        "django.contrib.auth",
        "django.contrib.contenttypes",
        "django.contrib.sessions",
        "django.contrib.messages",
        "django.contrib.staticfiles",
        # INTERNAL APPS
        "survey_api",
        "user",
        # EXTERNAL APPS
        "rest_framework",
        "drf_spectacular",
        "rest_framework_simplejwt",
        "django_filters",
        "django_celery_beat",
        "corsheaders",
    ]

    MIDDLEWARE = [
        "corsheaders.middleware.CorsMiddleware",
        "django.middleware.security.SecurityMiddleware",
        "django.contrib.sessions.middleware.SessionMiddleware",
        "django.middleware.common.CommonMiddleware",
        "django.middleware.csrf.CsrfViewMiddleware",
        "django.contrib.auth.middleware.AuthenticationMiddleware",
        "django.contrib.messages.middleware.MessageMiddleware",
        "django.middleware.clickjacking.XFrameOptionsMiddleware",
    ]

    ROOT_URLCONF = "backend.urls"

    TEMPLATES = [
        {
            "BACKEND": "django.template.backends.django.DjangoTemplates",
            "DIRS": [BASE_DIR / "templates"],
            "APP_DIRS": True,
            "OPTIONS": {
                "context_processors": [
                    "django.template.context_processors.debug",
                    "django.template.context_processors.request",
                    "django.contrib.auth.context_processors.auth",
                    "django.contrib.messages.context_processors.messages",
                ],
            },
        },
    ]

    WSGI_APPLICATION = "backend.wsgi.application"

    # Database
    # https://docs.djangoproject.com/en/5.1/ref/settings/#databases

    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": env("DB_NAME"),
            "USER": env("DB_USER"),
            "PASSWORD": env("DB_PASSWORD"),
            "HOST": env("DB_HOST"),
            "PORT": env("DB_PORT"),
        }
    }

    MEDIA_URL = "/media/"
    MEDIA_ROOT = BASE_DIR / "media"

    # Password validation
    # https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

    AUTH_PASSWORD_VALIDATORS = [
        {
            "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
        },
        {
            "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
        },
        {
            "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
        },
        {
            "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
        },
    ]

    # Internationalization
    # https://docs.djangoproject.com/en/5.1/topics/i18n/

    LANGUAGE_CODE = "en-us"

    TIME_ZONE = "Europe/Paris"
    USE_TZ = True

    USE_I18N = True

    USE_TZ = True

    # Static files (CSS, JavaScript, Images)
    # https://docs.djangoproject.com/en/5.1/howto/static-files/

    STATIC_URL = "static/"

    # Default primary key field type
    # https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

    DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

    AUTH_USER_MODEL = "user.user"

    CELERY_BROKER_URL = "redis://redis:6379/0"
    CELERY_ACCEPT_CONTENT = ["json"]
    CELERY_TASK_SERIALIZER = "json"
    CELERY_TIMEZONE = "Europe/Paris"
    CELERY_BEAT_SCHEDULER = "django_celery_beat.schedulers:DatabaseScheduler"

    REST_FRAMEWORK = {
        "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
        "DEFAULT_AUTHENTICATION_CLASSES": (
            "rest_framework_simplejwt.authentication.JWTAuthentication",
        ),
        "DEFAULT_FILTER_BACKENDS": [
            "django_filters.rest_framework.DjangoFilterBackend"
        ],
    }

    SIMPLE_JWT = {
        "ACCESS_TOKEN_LIFETIME": timedelta(minutes=30),
        "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
        "AUTH_HEADER_TYPES": ("Bearer",),
        "TOKEN_OBTAIN_SERIALIZER": "user.serializers.CustomTokenObtainPairSerializer",
    }

    CORS_ALLOW_ALL_ORIGINS = True

    STATICFILES_DIRS = [
        os.path.join(BASE_DIR, "static"),
    ]

    SPECTACULAR_SETTINGS = {
        "TITLE": "Surcher",
        "VERSION": "1.0.0",
        "SERVE_INCLUDE_SCHEMA": False,
        "CONTACT": {
            "name": "Surcher Django Admin",
            "url": "http://localhost:8000/admin/",
        },
        "TAGS": [
            {
                "name": "surveys",
                "description": "List or Retrieve Survey(s), questions and choices",
            },
            {
                "name": "results",
                "description": "List or Retrieve Survey(s) and demographics",
            },
            {"name": "responses", "description": "Submitting responses"},
            {
                "name": "organizations",
                "description": "Retrieve Organization",
            },
            {"name": "filters", "description": "List filters"},
            {"name": "has-responded", "description": "Verify if user has already responded a particular survey"},
            {"name": "user", "description": "User register and login"},
        ],
    }


class Prod(Dev):
    DEBUG = values.BooleanValue(False)
    ALLOWED_HOSTS = values.ListValue(["myproductiondomain.com"])
