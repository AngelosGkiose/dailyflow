from fastapi import APIRouter, Depends
from sqlalchemy.orm.session import Session
from starlette import status

from app.dependencies.authutils import get_current_user
from app.dependencies.db import get_db
from app.models.user_model import UserModel
from app.schemas.projects import ProjectCreate, ProjectResponse
from app.services.project_service import create_project_service, get_projects_service, get_project_by_id_service

router=APIRouter(prefix="/projects",tags=["Project"])

@router.post("/",response_model=ProjectResponse,status_code=status.HTTP_201_CREATED)
def create_project(project:ProjectCreate,current_user:UserModel=Depends(get_current_user),db:Session=Depends(get_db)):
    return create_project_service(project,current_user,db)

@router.get("/",response_model=list[ProjectResponse],status_code=status.HTTP_200_OK)
def get_projects(current_user:UserModel=Depends(get_current_user),db:Session=Depends(get_db)):
   return get_projects_service(current_user,db)

@router.get("/{project_id}",response_model=ProjectResponse,status_code=status.HTTP_200_OK)
def get_project_by_id(project_id:int,current_user:UserModel=Depends(get_current_user),db:Session=Depends(get_db)):
    return get_project_by_id_service(project_id, current_user, db)