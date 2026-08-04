from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers.register_router import router as auth_router
from app.routers.tasks_router import router as task_router
from app.routers.project_router import router as project_router
from app.routers.labels_router import router as label_router
from app.routers.dashboard_router import router as dashboard_router


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    debug=settings.debug
)

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
@app.get("/")
def root():
    return {"message": "DailyFlow API is running"}

app.include_router(auth_router)
app.include_router(task_router)
app.include_router(project_router)
app.include_router(label_router)
app.include_router(dashboard_router)