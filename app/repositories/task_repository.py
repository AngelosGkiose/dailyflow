from sqlalchemy.orm.session import Session

from app.models.task_model import TaskModel
from app.models.user_model import UserModel


def add_task(db: Session, task: TaskModel) -> TaskModel:
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

def get_tasks_by_user_id(db: Session, current_user:UserModel) -> TaskModel:
    return db.query(TaskModel).filter(TaskModel.user_id == current_user.id).all()