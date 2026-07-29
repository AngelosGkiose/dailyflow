from fastapi import APIRouter, Depends
from sqlalchemy.orm.session import Session
from starlette import status

from app.dependencies.authutils import get_current_user
from app.dependencies.db import get_db
from app.models.user_model import UserModel
from app.schemas.tasks import TaskResponse, TaskCreate
from app.services.task_service import create_task_service

router = APIRouter(
    prefix="/tasks",
    tags=["tasks"],
)

@router.post("/", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(request:TaskCreate,db:Session=Depends(get_db),current_user:UserModel=Depends(get_current_user)):
    return create_task_service(request,db,current_user)