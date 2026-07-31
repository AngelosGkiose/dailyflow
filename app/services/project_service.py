from fastapi import HTTPException
from sqlalchemy.orm.session import Session
from starlette import status

from app.models.project_model import ProjectModel
from app.models.user_model import UserModel
from app.repositories.project_repository import get_project_by_name, add_project, get_all_projects_by_user, \
    get_project_by_id_repo, updated_project_repo
from app.schemas.projects import ProjectCreate


def create_project_service(request:ProjectCreate,current_user:UserModel,db:Session):
    project=get_project_by_name(db,request.name,current_user.id)
    if project is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,detail="Project name already exists")
    project= ProjectModel(name=request.name,description=request.description,user_id=current_user.id)
    return add_project(db,project)


def get_projects_service(current_user:UserModel,db:Session):
    return get_all_projects_by_user(db,current_user.id)

def get_project_by_id_service(project_id:int,current_user:UserModel,db:Session):
    project= get_project_by_id_repo(db, project_id, current_user.id)
    if project is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )

    return project

def update_project_service(project_id:int,updated_project,current_user:UserModel,db:Session):
    project= get_project_by_id_repo(db, project_id, current_user.id)
    if project is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Project not found")
    update_data = updated_project.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(project, field, value)

    return updated_project_repo(db, project)
