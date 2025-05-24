from celery import shared_task
from django.utils import timezone
from .models import Survey


@shared_task
def deactivate_expired_surveys():
    now = timezone.now()
    expired = Survey.objects.filter(deadline__lt=now, is_active=True)
    count = expired.update(is_active=False)
    return f"{count} expired surveys deactivated."
