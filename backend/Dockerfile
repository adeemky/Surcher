FROM python:3.11-slim

WORKDIR /backend

COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt


COPY ./backend .

ENV DJANGO_CONFIGURATION=Dev
ENV DJANGO_SETTINGS_MODULE=backend.settings

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]