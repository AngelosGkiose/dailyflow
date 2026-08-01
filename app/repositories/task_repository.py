from sqlalchemy.orm.session import Session

from app.models.task_model import TaskModel, TaskStatus, TaskPriority
from app.models.user_model import UserModel


def add_task(db: Session, task: TaskModel) -> TaskModel:
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

def get_tasks_by_user_id(db: Session, current_user_id:int) -> list[TaskModel]:
    return db.query(TaskModel).filter(TaskModel.user_id == current_user_id).all()

def get_task_by_id(db: Session, task_id:int,current_user:UserModel) -> TaskModel:
    return db.query(TaskModel).filter(TaskModel.id == task_id, TaskModel.user_id == current_user.id).first()

def update_task( db: Session,task: TaskModel) -> TaskModel:
    db.commit()
    db.refresh(task)

    return task

def delete_task_repo(db: Session,task):
    db.delete(task)
    db.commit()

def get_tasks_inbox_repo(db: Session, current_user_id:int):
    return db.query(TaskModel).filter(TaskModel.user_id == current_user_id,TaskModel.project_id.is_(None)).all()

def get_tasks_by_project_id_repo(db: Session, project_id:int,current_user_id:int):
    return db.query(TaskModel).filter(TaskModel.project_id == project_id,TaskModel.user_id==current_user_id).all()

def get_filtered_tasks(db: Session,
    current_user_id: int,
    project_id: int | None,
    task_status: TaskStatus | None,
    priority: TaskPriority | None):
    query=db.query(TaskModel)
    query=query.filter(TaskModel.user_id == current_user_id)
    if project_id is not None:
        query=query.filter(TaskModel.project_id == project_id)
    if task_status is not None:
        query=query.filter(TaskModel.status == task_status)
    if priority is not None:
        query=query.filter(TaskModel.priority == priority)
    return query.all()