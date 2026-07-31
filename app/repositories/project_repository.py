from sqlalchemy.orm.session import Session

from app.models.project_model import ProjectModel
from app.schemas.projects import ProjectUpdate


def get_project_by_name(db:Session,project_name:str,current_user_id:int):
    return db.query(ProjectModel).filter(ProjectModel.name==project_name,ProjectModel.user_id==current_user_id).first()


def add_project(db:Session,project:ProjectModel):
     db.add(project)
     db.commit()
     db.refresh(project)
     return project


def get_all_projects_by_user(db:Session,current_user_id:int):
    return db.query(ProjectModel).filter(ProjectModel.user_id==current_user_id).all()

def get_project_by_id_repo(db:Session,project_id:int,current_user_id:int):
    return db.query(ProjectModel).filter(ProjectModel.user_id==current_user_id,ProjectModel.id==project_id).first()

def updated_project_repo(db:Session,project:ProjectModel):
    db.commit()
    db.refresh(project)