

from sqlalchemy.orm.session import Session

from app.models.label_model import LabelModel
from app.models.task_model import TaskModel, TaskStatus, TaskPriority
from app.models.user_model import UserModel
from sqlalchemy import or_
from datetime import date, datetime, time, timedelta

from app.schemas.tasks import TaskSortBy, SortOrder


def add_task(db: Session, task: TaskModel) -> TaskModel:
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

def get_tasks_by_user_id(db: Session, current_user_id:int):
    return db.query(TaskModel).filter(TaskModel.user_id == current_user_id).all()

def get_task_by_id(db: Session, task_id:int,current_user:UserModel):
    return db.query(TaskModel).filter(TaskModel.id == task_id, TaskModel.user_id == current_user.id).first()

def update_task( db: Session,task: TaskModel) -> TaskModel:
    db.commit()
    db.refresh(task)

    return task

def delete_task_repo(db: Session,task):
    db.delete(task)
    db.commit()

def get_tasks_inbox_repo(db: Session, current_user_id:int):
    return db.query(TaskModel).filter(TaskModel.user_id == current_user_id,TaskModel.project_id.is_(None),TaskModel.status==TaskStatus.PENDING).all()

def get_tasks_by_project_id_repo(db: Session, project_id:int,current_user_id:int):
    return db.query(TaskModel).filter(TaskModel.project_id == project_id,TaskModel.user_id==current_user_id).all()

def get_filtered_tasks(
    db: Session,
    current_user_id: int,
    project_id: int | None,
    task_status: TaskStatus | None,
    priority: TaskPriority | None,
    search: str | None,
    due_date: date | None,
    sort_by: TaskSortBy,
    order: SortOrder,
    page: int,
    page_size: int,label_id: int | None) :
    query = db.query(TaskModel).filter(
        TaskModel.user_id == current_user_id
    )

    if project_id is not None:
        query = query.filter(
            TaskModel.project_id == project_id
        )

    if task_status is not None:
        query = query.filter(
            TaskModel.status == task_status
        )

    if priority is not None:
        query = query.filter(
            TaskModel.priority == priority
        )

    if search is not None:
        search_pattern = f"%{search}%"

        query = query.filter(
            or_(
                TaskModel.title.ilike(search_pattern),
                TaskModel.description.ilike(search_pattern)
            )
        )

    if due_date is not None:
        start_datetime = datetime.combine(
            due_date,
            time.min
        )

        end_datetime = start_datetime + timedelta(days=1)

        query = query.filter(
            TaskModel.due_date >= start_datetime,
            TaskModel.due_date < end_datetime
        )
    if label_id is not None:
        query = query.filter(
            TaskModel.labels.any(
                LabelModel.id == label_id
            )
        )

    total = query.count()

    sort_columns = {
        TaskSortBy.CREATED_AT: TaskModel.created_at,
        TaskSortBy.UPDATED_AT: TaskModel.updated_at,
        TaskSortBy.DUE_DATE: TaskModel.due_date,
        TaskSortBy.TITLE: TaskModel.title
    }

    sort_column = sort_columns[sort_by]

    if order == SortOrder.ASC:
        query = query.order_by(
            sort_column.asc(),
            TaskModel.id.asc()
        )
    else:
        query = query.order_by(
            sort_column.desc(),
            TaskModel.id.desc()
        )

    offset = (page - 1) * page_size

    tasks = (
        query
        .offset(offset)
        .limit(page_size)
        .all()
    )

    return tasks, total

def commit_task_labels_repo(db: Session):
    db.commit()