# DailyFlow

DailyFlow is a full-stack task management application built with **FastAPI, PostgreSQL, React, and Docker**.

The project focuses on building a structured REST API with authentication, database relationships, filtering, pagination, migrations, and containerization.

A React frontend is included as a client for interacting with the API.

---

## Application Preview

![DailyFlow Dashboard](docs/dailyflow-dashboard.png)

---

## API Documentation

DailyFlow provides interactive API documentation through FastAPI's Swagger UI.

### Authentication

![DailyFlow Authentication API](docs/swagger-authentication.png)

### Tasks & Projects

![DailyFlow Tasks and Projects API](docs/swagger-tasks-projects.png)

### Labels & Dashboard

![DailyFlow Labels and Dashboard API](docs/swagger-labels-dashboard.png)

After starting the application, the interactive Swagger documentation is available at:

```text
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

## Features

### Authentication

- User registration
- User login and logout
- JWT-based authentication
- JWT stored in an HttpOnly cookie
- Protected endpoints
- Current authenticated user endpoint
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

The Tasks API supports:

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
- JavaScript
- CSS

### Infrastructure

- Docker
- Docker Compose

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

Pydantic schemas provide request validation and define the structure of API requests and responses.

### Models

SQLAlchemy models define the database entities and their relationships.

---

## Database

DailyFlow uses **PostgreSQL** as its relational database.

The main entities are:

```text
User
 │
 ├── Projects
 ├── Tasks
 └── Labels

Task
 │
 ├── Project
 └── Labels (many-to-many)
```

SQLAlchemy is used as the ORM, while Alembic manages database schema migrations.

When the application runs with Docker, PostgreSQL data is stored in a Docker volume so that the data persists when containers are stopped or recreated.

---

## Authentication Flow

DailyFlow uses JWT authentication with HttpOnly cookies.

```text
Login Request
     ↓
Validate Credentials
     ↓
Generate JWT
     ↓
Store JWT in HttpOnly Cookie
     ↓
Browser sends Cookie automatically
     ↓
Backend validates JWT
     ↓
Authenticated User
```

The JWT is not directly accessible from frontend JavaScript because it is stored in an HttpOnly cookie.

Passwords are never stored in plain text. They are hashed using Argon2 before being stored in the database.

---

# Setup Instructions

The recommended way to run DailyFlow is with **Docker**.

## Prerequisites

Install:

- Git
- Docker Desktop

When using Docker, you do not need to manually install PostgreSQL or the backend Python dependencies.

---

## 1. Clone the Repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd dailyflow
```

Replace `<YOUR_REPOSITORY_URL>` with the URL of this GitHub repository.

---

## 2. Configure Environment Variables

Create a `.env.docker` file in the project root:

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

> Do not commit `.env.docker`, passwords, secret keys, or other sensitive information to Git.

If your PostgreSQL password contains characters that have special meaning inside a URL, make sure the password used inside `DATABASE_URL` is URL-encoded.

---

## 3. Start the Application

From the project root, run:

```bash
docker compose up --build
```

Docker Compose starts the complete application:

```text
DailyFlow
│
├── Frontend Container
│   └── React + Vite
│
├── Backend Container
│   └── FastAPI
│
└── Database Container
    └── PostgreSQL
```

The backend automatically runs:

```bash
alembic upgrade head
```

before starting the FastAPI server.

This ensures that the PostgreSQL database schema is up to date.

---

## 4. Open the Application

### Frontend

```text
http://localhost:5173
```

### Backend API

```text
http://localhost:8000
```

### Swagger UI

```text
http://localhost:8000/docs
```

---

## 5. Stop the Application

Press:

```text
Ctrl + C
```

Then run:

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

The backend can also be run locally without Docker.

## 1. Create a Virtual Environment

```bash
python -m venv .venv
```

On Windows, activate it with:

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

Create a PostgreSQL database and user.

Configure the required environment variables:

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

Swagger UI:

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
│
├── frontend/
│
├── docs/
│   ├── swagger-authentication.png
│   ├── swagger-tasks-projects.png
│   ├── swagger-labels-dashboard.png
│   └── dailyflow-dashboard.png
│
├── Dockerfile
├── compose.yaml
├── alembic.ini
├── requirements.txt
└── README.md
```

---

## What This Project Demonstrates

DailyFlow demonstrates practical backend and REST API development concepts including:

- REST API design with FastAPI
- CRUD operations
- Layered backend architecture
- Dependency injection
- Authentication and authorization
- JWT authentication with HttpOnly cookies
- Password hashing
- Request and response validation
- SQLAlchemy ORM
- Relational database design
- One-to-many relationships
- Many-to-many relationships
- Filtering and searching
- Sorting and pagination
- PostgreSQL integration
- Database migrations with Alembic
- CORS configuration
- Environment-based configuration
- Docker containerization
- Multi-container applications with Docker Compose
- Persistent database storage with Docker volumes
- OpenAPI and Swagger documentation

---

## Development Status

DailyFlow is under active development.

The core REST API, authentication system, task management functionality, PostgreSQL database, React frontend, and Docker environment are implemented.

---

## Author

Developed by Angelos.