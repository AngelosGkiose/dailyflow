from datetime import  datetime

from sqlalchemy.orm import Session

from app.models.task_model import TaskModel, TaskStatus


def today_tasks_repo(db:Session,current_user_id:int,start_tomorrow:datetime):
    return db.query(TaskModel).filter(TaskModel.user_id==current_user_id,TaskModel.status==TaskStatus.PENDING,TaskModel.due_date < start_tomorrow).order_by(TaskModel.due_date.asc()).all()

def upcoming_tasks_repo(db:Session,current_user_id:int,start_tomorrow:datetime):
    return db.query(TaskModel).filter(TaskModel.user_id==current_user_id,TaskModel.status==TaskStatus.PENDING,TaskModel.due_date >= start_tomorrow).order_by(TaskModel.due_date.asc(),TaskModel.id.asc()).all()

def overdue_task_repo(db:Session,current_user_id:int,now:datetime):
    return db.query(TaskModel).filter(TaskModel.user_id == current_user_id, TaskModel.status == TaskStatus.PENDING, TaskModel.due_date < now).order_by(TaskModel.due_date.asc(), TaskModel.id.asc()).all()