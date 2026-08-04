from datetime import date

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm.session import Session
from starlette import status

from app.dependencies.authutils import get_current_user
from app.dependencies.db import get_db
from app.models.task_model import TaskStatus, TaskPriority
from app.models.user_model import UserModel
from app.schemas.tasks import TaskResponse, TaskCreate, TaskUpdate, TaskSortBy, SortOrder, TaskPaginationResponse
from app.services.task_service import create_task_service, get_tasks_service, get_task_by_id_service, \
    update_task_service, delete_task_service, complete_task_service, reopen_task_service, get_tasks_inbox_service, \
    add_label_to_task_service, delete_label_from_task_service

router = APIRouter(
    prefix="/tasks",
    tags=["tasks"],
)

@router.post("/", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(request:TaskCreate,db:Session=Depends(get_db),current_user:UserModel=Depends(get_current_user)):
    return create_task_service(request,db,current_user)

@router.get("/",response_model=TaskPaginationResponse,status_code=status.HTTP_200_OK)
def get_tasks(project_id: int | None = Query(default=None,gt=0),
    task_status: TaskStatus | None = Query(
    default=None,
    alias="status"),
    priority: TaskPriority | None = None,
    search:str|None = Query(default=None,max_length=100),
    due_date: date | None = Query(default=None),
    sort_by: TaskSortBy = Query(
    default=TaskSortBy.CREATED_AT),
    order: SortOrder = Query(
    default=SortOrder.DESC),
    page: int = Query( default=1,ge=1),
    page_size: int = Query(default=20,ge=1,le=100),
    label_id: int | None = Query(default=None,gt=0),
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db)):
    return get_tasks_service(project_id,task_status,priority,search,due_date,sort_by,order,page,page_size,label_id,current_user,db)

@router.get("/inbox",response_model=list[TaskResponse],status_code=status.HTTP_200_OK)
def get_tasks_inbox(current_user:UserModel=Depends(get_current_user),db:Session=Depends(get_db)):
    return get_tasks_inbox_service(current_user,db)

@router.get("/{task_id}",response_model=TaskResponse,status_code=status.HTTP_200_OK)
def get_task_by_id(task_id:int,current_user:UserModel=Depends(get_current_user),db:Session=Depends(get_db)):
    return get_task_by_id_service(task_id, current_user, db)

@router.patch("/{task_id}",response_model=TaskResponse,status_code=status.HTTP_200_OK)
def update_task(task_id:int,updated_task:TaskUpdate,current_user:UserModel=Depends(get_current_user),db:Session=Depends(get_db)):
    return update_task_service(task_id, updated_task, current_user, db)

@router.delete("/{task_id}",status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id:int,current_user:UserModel=Depends(get_current_user),db:Session=Depends(get_db)):
    delete_task_service(task_id, current_user, db)

@router.patch("/{task_id}/complete",response_model=TaskResponse,status_code=status.HTTP_200_OK)
def complete_task(task_id:int,current_user:UserModel=Depends(get_current_user),db:Session=Depends(get_db)):
    return complete_task_service(task_id, current_user, db)

@router.patch("/{task_id}/reopen",response_model=TaskResponse,status_code=status.HTTP_200_OK)
def reopen_task(task_id:int,current_user:UserModel=Depends(get_current_user),db:Session=Depends(get_db)):
    return reopen_task_service(task_id, current_user, db)

@router.post("/{task_id}/labels/{label_id}",response_model=TaskResponse,status_code=status.HTTP_200_OK)
def add_label_to_task(task_id:int,label_id:int,current_user:UserModel=Depends(get_current_user),db:Session=Depends(get_db)):
    return add_label_to_task_service(task_id, label_id, current_user, db)

@router.delete("/{task_id}/labels/{label_id}",status_code=status.HTTP_204_NO_CONTENT)
def delete_label_from_task(task_id:int,label_id:int,current_user:UserModel=Depends(get_current_user),db:Session=Depends(get_db)):
    return delete_label_from_task_service(task_id,label_id,current_user,db)


