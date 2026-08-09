from fastapi import APIRouter, Depends
from sqlalchemy.orm.session import Session
from starlette import status

from app.dependencies.authutils import get_current_user
from app.dependencies.db import get_db
from app.models.user_model import UserModel
from app.schemas.dashboard import DashboardSummaryResponse
from app.schemas.tasks import TaskResponse
from app.services.dashboard_service import get_statistics_service, overdue_tasks_service, today_tasks_service, upcoming_tasks_service

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/today", response_model=list[TaskResponse],
            status_code=status.HTTP_200_OK, summary="Get today's tasks",
            description="Returns all pending tasks belonging to the authenticated user that are due today.",
            responses={401: {"description": "Authentication credentials are missing or invalid."}})
def get_today(current_user: UserModel = Depends(get_current_user), db: Session = Depends(get_db)):
    return today_tasks_service(db, current_user)


@router.get("/upcoming", response_model=list[TaskResponse],
            status_code=status.HTTP_200_OK, summary="Get upcoming tasks",
            description="Returns pending tasks belonging to the authenticated user that have a future due date.",
            responses={401: {"description": "Authentication credentials are missing or invalid."}})
def get_upcoming(current_user: UserModel = Depends(get_current_user), db: Session = Depends(get_db)):
    return upcoming_tasks_service(db, current_user)


@router.get("/overdue", response_model=list[TaskResponse],
            status_code=status.HTTP_200_OK,
            summary="Get overdue tasks",
            description="Returns pending tasks belonging to the authenticated user whose due date has already passed.",
            responses={401: {"description": "Authentication credentials are missing or invalid."}})
def get_overdue(current_user: UserModel = Depends(get_current_user), db: Session = Depends(get_db)):
    return overdue_tasks_service(db, current_user)


@router.get("/summary", response_model=DashboardSummaryResponse,
            status_code=status.HTTP_200_OK, summary="Get dashboard summary",
            description="Returns task statistics for the authenticated user's dashboard.",
            responses={401: {"description": "Authentication credentials are missing or invalid."}})
def get_statistics(current_user: UserModel = Depends(get_current_user), db: Session = Depends(get_db)):
    return get_statistics_service(db, current_user)