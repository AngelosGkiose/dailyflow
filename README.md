# DailyFlow

DailyFlow is a personal task management web application inspired by Todoist.

The project is being developed with FastAPI, SQLAlchemy, SQLite, and a REST API architecture.

## Current Features

- FastAPI application setup
- Environment-based configuration
- SQLite database connection
- Health check endpoint
- Automatic Swagger documentation

## Run Locally

Create and activate a virtual environment:

```bash
python -m venv .venv

Install dependencies:

python -m pip install -r requirements.txt

Run the application:

fastapi dev app/main.py

Open the API documentation:

http://127.0.0.1:8000/docs