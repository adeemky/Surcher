# 🌍 Surcher
Surcher is a web platform designed to help NGOs collect impactful data through surveys. Volunteers can register, respond to surveys, and contribute to real change. Once the survey deadline passes, all responses and graphs are automatically made public — because change begins with listening.

---

## 🧩 Features
- 📋 User participation in NGO-led surveys
- 🧑‍💻 Admin panel for NGO survey creation
- ⏱️ Automatic public display of results after survey deadlines
- 🧪 Custom command for loading demo data
- 🐳 Dockerized backend and frontend (separate Dockerfiles)
- ⏰ Asynchronous task support with Celery + Redis

---

## 🚀 Quick Start (Local)

### Requirements
- Docker & Docker Compose
- Python 3.11 (if running without Docker)
- Node.js 18+

### Run with Docker
docker-compose up --build


> Frontend: `http://localhost:3000`
> Backend API: `http://localhost:8000/api/`

To load demo data:

```bash
python manage.py load_demo_data
```

> ⚠️ Celery tasks must be created manually in the Django admin panel (`/admin`). Add a `PeriodicTask` and corresponding `CrontabSchedule`.

---

## 🔐 Environment Variables

### Backend (.env)

```env
DEBUG=True
SECRET_KEY=your_secret_key
ALLOWED_HOSTS=localhost,127.0.0.1
```

---

## 📡 API Endpoints
You can view the full API documentation at: [http://localhost:8000/api/docs/]

### Authentication

| Method | Endpoint        | Description                         |
|--------|------------------|-------------------------------------|
| POST   | `/token/`        | Obtain access and refresh token     |
| POST   | `/token/refresh/`| Refresh access token                |

### Surveys

| Method | Endpoint               | Description                            |
|--------|------------------------|----------------------------------------|
| GET    | `/surveys/`            | List all surveys                       |
| GET    | `/surveys/<id>/`       | Retrieve a single survey               |
| POST   | `/responses`           | Submit a response to a survey          |
| GET    | `/has-responded/<id>/` | Check if current user has responded    |
| GET    | `/results/<id>/`       | Get public results (after deadline)    |

### Filters

| Method | Endpoint                    | Description         |
|--------|-----------------------------|---------------------|
| GET    | `/filters/categories/`      | Get category list   |
| GET    | `/filters/organizations/`   | Get organization list |

---

## 🧪 Demo Data
To load test users, surveys, and sample responses:

```bash
python manage.py load_demo_data
```

---

## ⏱️ Scheduled Tasks
Celery and Redis are configured but require a manual setup via the Django Admin:

1. Visit `/admin/django_celery_beat/periodictask/`
2. Add a new task using a Crontab schedule (e.g., `publish_results`)
