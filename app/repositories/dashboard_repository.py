from datetime import  datetime

from sqlalchemy.orm import Session

from app.models.project_model import ProjectModel
from app.models.task_model import TaskModel, TaskStatus



def today_tasks_repo(db:Session,current_user_id:int,start_tomorrow:datetime):
    return db.query(TaskModel).filter(TaskModel.user_id==current_user_id,TaskModel.status==TaskStatus.PENDING,TaskModel.due_date < start_tomorrow).order_by(TaskModel.due_date.asc()).all()

def upcoming_tasks_repo(db:Session,current_user_id:int,start_tomorrow:datetime):
    return db.query(TaskModel).filter(TaskModel.user_id==current_user_id,TaskModel.status==TaskStatus.PENDING,TaskModel.due_date >= start_tomorrow).order_by(TaskModel.due_date.asc(),TaskModel.id.asc()).all()

def overdue_task_repo(db:Session,current_user_id:int,now:datetime):
    return db.query(TaskModel).filter(TaskModel.user_id == current_user_id, TaskModel.status == TaskStatus.PENDING, TaskModel.due_date < now).order_by(TaskModel.due_date.asc(), TaskModel.id.asc()).all()

def get_summary_repo(db:Session,current_user_id:int,start_tomorrow:datetime,now:datetime):
    total_tasks=db.query(TaskModel).filter(TaskModel.user_id==current_user_id).count()
    pending_tasks=db.query(TaskModel).filter(TaskModel.user_id==current_user_id,TaskModel.status == TaskStatus.PENDING).count()
    completed_tasks=db.query(TaskModel).filter(TaskModel.user_id==current_user_id,TaskModel.status==TaskStatus.COMPLETED).count()
    today_tasks=db.query(TaskModel).filter(TaskModel.user_id==current_user_id,TaskModel.status==TaskStatus.PENDING,TaskModel.due_date < start_tomorrow).count()
    overdue_tasks=db.query(TaskModel).filter(TaskModel.user_id==current_user_id,TaskModel.status==TaskStatus.PENDING,TaskModel.due_date < now).count()
    total_projects=db.query(ProjectModel).filter(ProjectModel.user_id==current_user_id).count()
    return {
        'total_tasks':total_tasks,
        'pending_tasks':pending_tasks,
        'completed_tasks':completed_tasks,
        'today_tasks':today_tasks,
        'overdue_tasks':overdue_tasks,
        'total_projects':total_projects
    }
