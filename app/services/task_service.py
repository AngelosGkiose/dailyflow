from sqlalchemy.orm.session import Session

from app.models.task_model import  TaskModel
from app.models.user_model import UserModel
from app.repositories.task_repository import add_task, get_tasks_by_user_id
from app.schemas.tasks import TaskCreate


def create_task_service(request:TaskCreate,db:Session,current_user:UserModel):
    new_task=TaskModel(title=request.title,description=request.description,
                       priority=request.priority,due_date=request.due_date, user_id=current_user.id)
    return add_task(db, new_task)

def get_tasks_service(current_user:UserModel,db:Session):
    return get_tasks_by_user_id(db, current_user)
