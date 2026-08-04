import math
from datetime import datetime, timezone, date

from fastapi import HTTPException
from sqlalchemy.orm.session import Session
from starlette import status

from app.models.task_model import TaskModel, TaskStatus, TaskPriority
from app.models.user_model import UserModel
from app.repositories.label_repository import get_label_by_id_repo
from app.repositories.project_repository import get_project_by_id_repo
from app.repositories.task_repository import add_task, get_tasks_by_user_id, get_task_by_id, update_task, \
    delete_task_repo, get_tasks_inbox_repo, get_tasks_by_project_id_repo, get_filtered_tasks, commit_task_labels_repo
from app.schemas.tasks import TaskCreate, TaskUpdate, TaskSortBy, SortOrder, TaskPaginationResponse


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


def get_tasks_service(project_id: int | None,
    task_status: TaskStatus | None,
    priority: TaskPriority | None,
    search: str | None,
    due_date: date | None,
    sort_by:TaskSortBy,
    order: SortOrder,
    page:int,
    page_size:int,label_id:int |None,
    current_user: UserModel,
    db: Session):
    if project_id is not None:
        project = get_project_by_id_repo(db, project_id, current_user.id)
        if project is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    if search is not None:
        search=search.strip()
        if not search:
            search = None
    if label_id is not None:
        label = get_label_by_id_repo(db, label_id, current_user.id)
        if label is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Label not found")
    tasks,total=get_filtered_tasks(db,current_user.id, project_id,task_status,priority,search,due_date,sort_by,order,page,page_size,label_id)
    total_pages=math.ceil(total/page_size)
    return TaskPaginationResponse(
        items=tasks,
        page=page,
        page_size=page_size,
        total=total,
        total_pages=total_pages
    )


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

def add_label_to_task_service(task_id:int,label_id:int,current_user:UserModel,db:Session)->TaskModel:
    task= get_task_by_id(db, task_id, current_user)
    if task is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Task not found")
    label=get_label_by_id_repo(db, label_id, current_user.id)
    if label is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Label not found")
    if label  in task.labels:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,detail="Label already exists")
    task.labels.append(label)
    return update_task(db, task)

def delete_label_from_task_service(task_id:int,label_id:int,current_user:UserModel,db:Session):
    task= get_task_by_id(db, task_id, current_user)
    if task is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Task not found")
    label= get_label_by_id_repo(db, label_id, current_user.id)
    if label is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Label not found")
    if label not in task.labels:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,detail="Label is not assigned to task")
    task.labels.remove(label)
    return commit_task_labels_repo(db)


