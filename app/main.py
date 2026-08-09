from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers.register_router import router as auth_router
from app.routers.tasks_router import router as task_router
from app.routers.project_router import router as project_router
from app.routers.labels_router import router as label_router
from app.routers.dashboard_router import router as dashboard_router


tags_metadata = [
    {"name": "Authentication", "description": "Register, login, logout and retrieve the currently authenticated user."},
    {"name": "Tasks", "description": "Create, retrieve, update, delete, complete, reopen, filter and organize tasks."},
    {"name": "Projects", "description": "Create and manage projects used to organize tasks."},
    {"name": "Labels", "description": "Create and manage labels and assign them to tasks."},
    {"name": "Dashboard", "description": "Retrieve today, upcoming, overdue tasks and dashboard statistics."},
]


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    debug=settings.debug,
    description="DailyFlow is a REST API for managing tasks, projects and labels with HttpOnly cookie authentication.",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_tags=tags_metadata,
)


origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]


app.add_middleware(CORSMiddleware,
                   allow_origins=origins,
                   allow_credentials=True,
                   allow_methods=["*"],
                   allow_headers=["*"])


@app.get("/")
def root():
    return {"message": "DailyFlow API is running"}


app.include_router(auth_router)
app.include_router(task_router)
app.include_router(project_router)
app.include_router(label_router)
app.include_router(dashboard_router)