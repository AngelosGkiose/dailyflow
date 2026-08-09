# DailyFlow

DailyFlow is a full-stack task management application built primarily as a **backend REST API project** using FastAPI.

The main focus of the project is backend development: REST API design, authentication, database relationships, layered architecture, filtering, pagination, database migrations, and containerization.

A React frontend is included as a client for interacting with the API.

---

## Backend Features

### Authentication

- User registration
- User login and logout
- JWT-based authentication
- JWT stored in an HttpOnly cookie
- Protected endpoints
- Current authenticated user endpoint (`/auth/me`)
- Password hashing with Argon2
- User-specific resource access

### Task Management

- Create tasks
- Retrieve tasks
- Retrieve individual tasks
- Update tasks
- Delete tasks
- Complete tasks
- Reopen completed tasks
- Inbox tasks
- Task priorities
- Due dates

### Task Querying

The tasks API supports:

- Filtering by status
- Filtering by priority
- Filtering by project
- Filtering by label
- Filtering by due date
- Search
- Sorting
- Pagination

### Projects

- Create projects
- Retrieve projects
- Retrieve individual projects
- Update projects
- Delete projects
- Associate tasks with projects

### Labels

- Create labels
- Retrieve labels
- Retrieve individual labels
- Update labels
- Delete labels
- Assign labels to tasks
- Remove labels from tasks

### Dashboard

Dedicated API endpoints provide:

- Today's tasks
- Upcoming tasks
- Overdue tasks
- Task statistics

---

## Backend Architecture

The backend follows a layered architecture:

```text
HTTP Request
     ↓
Router
     ↓
Service
     ↓
Repository
     ↓
SQLAlchemy ORM
     ↓
PostgreSQL
```

### Routers

Routers define the API endpoints and handle HTTP-specific concerns such as request parameters, dependencies, response models, and status codes.

### Services

The service layer contains the application's business logic.

### Repositories

Repositories handle database queries and persistence operations.

### Schemas

Pydantic schemas provide request validation and control the structure of API responses.

### Models

SQLAlchemy models define the database entities and relationships.

---

## Tech Stack

### Backend

- Python
- FastAPI
- SQLAlchemy
- PostgreSQL
- Alembic
- Pydantic
- PyJWT
- Argon2
- Uvicorn

### Frontend

- React
- Vite
- React Router

### Infrastructure

- Docker
- Docker Compose

---

## Database

DailyFlow uses PostgreSQL as its relational database.

The main entities include:

```text
User
 │
 ├── Projects
 │
 ├── Tasks
 │
 └── Labels

Task
 │
 ├── Project
 └── Labels (many-to-many)
```

SQLAlchemy is used as the ORM.

Database schema changes are managed using Alembic migrations.

---

## Authentication Flow

DailyFlow uses JWT authentication with HttpOnly cookies.

```text
Login Request
     ↓
Validate email/password
     ↓
Generate JWT access token
     ↓
Store token in HttpOnly cookie
     ↓
Browser sends cookie automatically
     ↓
Backend validates JWT
     ↓
Authenticated User
```

The frontend does not need direct access to the JWT.

---

## API Documentation

FastAPI automatically generates interactive OpenAPI documentation.

After starting the backend:

```text
Swagger UI:
http://localhost:8000/docs
```

The API is organized into the following groups:

```text
/auth
/tasks
/projects
/labels
/dashboard
```

---

# Setup Instructions

The recommended way to run DailyFlow is with Docker.

## Prerequisites

Install:

- Git
- Docker Desktop

You do not need to manually install PostgreSQL or the Python dependencies when using Docker.

---

## 1. Clone the Repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd dailyflow
```

---

## 2. Configure Environment Variables

Create a `.env.docker` file in the project root.

```env
POSTGRES_DB=dailyflow
POSTGRES_USER=dailyflow_user
POSTGRES_PASSWORD=your_password

APP_NAME=DailyFlow
APP_VERSION=1.0.0
DEBUG=True

SECRET_KEY=your_secret_key
ALGORITHM=HS256
EXPIRATION_TIME=60

DATABASE_URL=postgresql+psycopg://dailyflow_user:your_password@db:5432/dailyflow
```

Replace the example values with your own values.

Do not commit `.env.docker` or any real secrets to Git.

---

## 3. Start DailyFlow

From the project root:

```bash
docker compose up --build
```

## 4. Open the Application

Frontend:

```text
http://localhost:5173
```

Backend API:

```text
http://localhost:8000
```

Swagger UI:

```text
http://localhost:8000/docs
```

---

## 5. Stop the Application

Press:

```text
Ctrl + C
```

Then:

```bash
docker compose down
```

PostgreSQL data is stored in a Docker volume, so the data remains available when the containers are recreated.

To start the application again:

```bash
docker compose up
```

---

# Local Backend Development

The backend can also be run without Docker for development.

## 1. Create a Virtual Environment

Windows:

```bash
python -m venv .venv
```

Activate it:

```bash
.venv\Scripts\activate
```

---

## 2. Install Backend Dependencies

```bash
pip install -r requirements.txt
```

---

## 3. Configure PostgreSQL

Create a PostgreSQL database and user, then configure the backend environment variables.

Example:

```env
DATABASE_URL=postgresql+psycopg://dailyflow_user:your_password@localhost:5432/dailyflow

SECRET_KEY=your_secret_key
ALGORITHM=HS256
EXPIRATION_TIME=60
```

---

## 4. Apply Database Migrations

```bash
alembic upgrade head
```

---

## 5. Start the FastAPI Server

```bash
uvicorn app.main:app --reload
```

The API will be available at:

```text
http://127.0.0.1:8000
```

Swagger:

```text
http://127.0.0.1:8000/docs
```

---

## Project Structure

```text
dailyflow/
│
├── app/
│   ├── database/
│   ├── dependencies/
│   ├── models/
│   ├── repositories/
│   ├── routers/
│   ├── schemas/
│   ├── services/
│   ├── config.py
│   └── main.py
│
├── alembic/
├── frontend/
│
├── Dockerfile
├── compose.yaml
├── alembic.ini
├── requirements.txt
└── README.md
```

---

## What This Project Demonstrates

DailyFlow demonstrates practical backend development concepts including:

- REST API design with FastAPI
- CRUD API development
- Layered backend architecture
- Dependency injection
- Authentication and authorization
- JWT authentication with HttpOnly cookies
- Password hashing
- Request and response validation
- SQLAlchemy ORM
- Relational database design
- One-to-many and many-to-many relationships
- Filtering and searching
- Sorting and pagination
- Database migrations with Alembic
- PostgreSQL integration
- CORS configuration
- Environment-based configuration
- Docker containerization
- Multi-container applications with Docker Compose
- Automatic API documentation with OpenAPI/Swagger

---

## Development Status

DailyFlow is under active development.

The core backend API, authentication system, PostgreSQL database, React client, and Docker environment are implemented.

---

## Author

Developed by Angelos.