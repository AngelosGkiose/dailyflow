from datetime import datetime, timezone

from fastapi import HTTPException
from sqlalchemy.orm.session import Session
from starlette import status

from app.models.task_model import TaskModel, TaskStatus, TaskPriority
from app.models.user_model import UserModel
from app.repositories.project_repository import get_project_by_id_repo
from app.repositories.task_repository import add_task, get_tasks_by_user_id, get_task_by_id, update_task, \
    delete_task_repo, get_tasks_inbox_repo, get_tasks_by_project_id_repo, get_filtered_tasks
from app.schemas.tasks import TaskCreate, TaskUpdate


def create_task_service(request:TaskCreate,db:Session,current_user:UserModel):
    project_id=request.project_id
    if project_id is not None:
        project = get_project_by_id_repo(
            db,
            project_id,
            current_user.id
        )
        if project is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found"
            )
    new_task = TaskModel(
        title=request.title,
        description=request.description,
        priority=request.priority,
        due_date=request.due_date,
        user_id=current_user.id,
        project_id=project_id
    )
    return add_task(db, new_task)


def get_tasks_service(project_id:int,task_status: TaskStatus,priority: TaskPriority,current_user:UserModel,db:Session):
    if project_id is not None:
        project = get_project_by_id_repo(db, project_id, current_user.id)
        if project is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    return get_filtered_tasks(db,current_user.id, project_id,task_status,priority)


def get_task_by_id_service(task_id,current_user:UserModel,db:Session)->TaskModel:
    task= get_task_by_id(db, task_id, current_user)
    if task is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Task not found")
    return task

def update_task_service(
    task_id: int,
    updated_task: TaskUpdate,
    current_user: UserModel,
    db: Session
) -> TaskModel:
    task = get_task_by_id(
        db,
        task_id,
        current_user
    )
    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    update_data = updated_task.model_dump(
        exclude_unset=True
    )
    if "project_id" in update_data:
        project_id = update_data["project_id"]
        if project_id is not None:
            project = get_project_by_id_repo(
                db,
                project_id,
                current_user.id
            )
            if project is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Project not found"
                )
    for field, value in update_data.items():
        setattr(task, field, value)

    return update_task(db, task)

def delete_task_service(task_id:int,current_user:UserModel,db:Session):
    task= get_task_by_id(db, task_id, current_user)
    if task is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Task not found")
    delete_task_repo(db, task)

def complete_task_service(task_id:int,current_user:UserModel,db:Session)->TaskModel:
    task= get_task_by_id(db, task_id, current_user)
    if task is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Task not found")
    if task.status == TaskStatus.COMPLETED:
        return task
    task.status = TaskStatus.COMPLETED
    task.completed_at = datetime.now(timezone.utc)
    task.updated_at = datetime.now(timezone.utc)
    return update_task(db, task)

def reopen_task_service(task_id:int,current_user:UserModel,db:Session)->TaskModel:
    task= get_task_by_id(db, task_id, current_user)
    if task is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Task not found")
    if task.status==TaskStatus.PENDING:
        return task
    task.status = TaskStatus.PENDING
    task.updated_at = datetime.now(timezone.utc)
    task.completed_at = None
    return update_task(db, task)

def get_tasks_inbox_service(current_user:UserModel,db:Session):
    return get_tasks_inbox_repo(db, current_user.id)



