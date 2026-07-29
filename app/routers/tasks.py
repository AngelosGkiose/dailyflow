from fastapi import APIRouter, Depends
from sqlalchemy.orm.session import Session
from starlette import status

from app.dependencies.authutils import get_current_user
from app.dependencies.db import get_db
from app.models.user_model import UserModel
from app.schemas.tasks import TaskResponse, TaskCreate, TaskUpdate
from app.services.task_service import create_task_service, get_tasks_service, get_task_by_id_service, \
    update_task_service

router = APIRouter(
    prefix="/tasks",
    tags=["tasks"],
)

@router.post("/", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(request:TaskCreate,db:Session=Depends(get_db),current_user:UserModel=Depends(get_current_user)):
    return create_task_service(request,db,current_user)

@router.get("/",response_model=list[TaskResponse],status_code=status.HTTP_200_OK)
def get_tasks(current_user:UserModel=Depends(get_current_user),db:Session=Depends(get_db)):
    return get_tasks_service(current_user,db)

@router.get("/{task_id}",response_model=TaskResponse,status_code=status.HTTP_200_OK)
def get_task_by_id(task_id:int,current_user:UserModel=Depends(get_current_user),db:Session=Depends(get_db)):
    return get_task_by_id_service(task_id, current_user, db)

@router.patch("/{task_id}",response_model=TaskResponse,status_code=status.HTTP_200_OK)
def update_task(task_id:int,updated_task:TaskUpdate,current_user:UserModel=Depends(get_current_user),db:Session=Depends(get_db)):
    return update_task_service(task_id, updated_task, current_user, db)