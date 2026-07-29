from fastapi import HTTPException
from sqlalchemy.orm.session import Session
from starlette import status

from app.models.task_model import  TaskModel
from app.models.user_model import UserModel
from app.repositories.task_repository import add_task, get_tasks_by_user_id, get_task_by_id, update_task
from app.schemas.tasks import TaskCreate, TaskUpdate


def create_task_service(request:TaskCreate,db:Session,current_user:UserModel):
    new_task=TaskModel(title=request.title,description=request.description,
                       priority=request.priority,due_date=request.due_date, user_id=current_user.id)
    return add_task(db, new_task)

def get_tasks_service(current_user:UserModel,db:Session)->list[TaskModel]:
    return get_tasks_by_user_id(db, current_user)


def get_task_by_id_service(task_id,current_user:UserModel,db:Session)->TaskModel:
    task= get_task_by_id(db, task_id, current_user)
    if task is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Task not found")
    return task

def update_task_service(task_id:int,updated_task:TaskUpdate,current_user:UserModel,db:Session)->TaskModel:
    task= get_task_by_id(db, task_id, current_user)
    if task is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Task not found")
    update_data = updated_task.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(task, field, value)

    return update_task(db, task)