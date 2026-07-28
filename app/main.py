from fastapi import FastAPI

from app.config import settings


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    debug=settings.debug
)

@app.get("/")
def root():
    return {
        "message": "Welcome to DailyFlow API"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }