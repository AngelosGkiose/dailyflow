from sqlalchemy.orm.session import Session

from app.models.task_model import TaskModel


def add_task(db: Session, task: TaskModel) -> TaskModel:
    db.add(task)
    db.commit()
    db.refresh(task)
    return task