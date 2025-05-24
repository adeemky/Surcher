import os
from celery import Celery
from configurations import importer

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
os.environ.setdefault("DJANGO_CONFIGURATION", "Dev")


importer.install(check_options=True)

app = Celery("backend")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()


# Terminal1 Celery Worker:  celery -A backend worker --loglevel=info
# Terminal2 Celery Beat:    celery -A backend beat --loglevel=info
# Terminal3 Start Redis:    brew services start redis
