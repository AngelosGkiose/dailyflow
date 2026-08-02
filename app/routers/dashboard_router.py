from fastapi import APIRouter, Depends
from sqlalchemy.orm.session import Session
from starlette import status

from app.dependencies.authutils import get_current_user
from app.dependencies.db import get_db
from app.models.user_model import UserModel
from app.schemas.tasks import TaskResponse
from app.services.dashboard_service import today_tasks_service

router=APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/today",response_model=list[TaskResponse],status_code=status.HTTP_200_OK)
def get_today(current_user: UserModel = Depends(get_current_user),db: Session = Depends(get_db)):
    return today_tasks_service(db,current_user)
