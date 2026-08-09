from fastapi import APIRouter, Depends
from sqlalchemy.orm.session import Session
from starlette import status

from app.dependencies.authutils import get_current_user
from app.dependencies.db import get_db
from app.models.user_model import UserModel
from app.schemas.projects import ProjectCreate, ProjectResponse, ProjectUpdate
from app.services.project_service import create_project_service, delete_project_service, get_project_by_id_service, get_projects_service, update_project_service

router = APIRouter(prefix="/projects", tags=["Projects"])


@router.post("/", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED,
             summary="Create project", description="Creates a new project for the authenticated user.",
             responses={401: {"description": "Authentication credentials are missing or invalid."},
                        422: {"description": "The submitted project data is invalid."}})
def create_project(project: ProjectCreate, current_user: UserModel = Depends(get_current_user), db: Session = Depends(get_db)):
    return create_project_service(project, current_user, db)


@router.get("/", response_model=list[ProjectResponse], status_code=status.HTTP_200_OK,
            summary="List projects", description="Returns all projects belonging to the authenticated user.",
            responses={401: {"description": "Authentication credentials are missing or invalid."}})
def get_projects(current_user: UserModel = Depends(get_current_user), db: Session = Depends(get_db)):
    return get_projects_service(current_user, db)


@router.get("/{project_id}", response_model=ProjectResponse, status_code=status.HTTP_200_OK,
            summary="Get project", description="Returns a project by ID if it belongs to the authenticated user.",
            responses={401: {"description": "Authentication credentials are missing or invalid."},
                       404: {"description": "Project not found."}})
def get_project_by_id(project_id: int, current_user: UserModel = Depends(get_current_user), db: Session = Depends(get_db)):
    return get_project_by_id_service(project_id, current_user, db)


@router.patch("/{project_id}", response_model=ProjectResponse, status_code=status.HTTP_200_OK,
              summary="Update project", description="Updates a project belonging to the authenticated user.",
              responses={401: {"description": "Authentication credentials are missing or invalid."},
                         404: {"description": "Project not found."},
                         422: {"description": "The submitted project data is invalid."}})
def update_project(project_id: int, updated_project: ProjectUpdate, current_user: UserModel = Depends(get_current_user),
                   db: Session = Depends(get_db)):
    return update_project_service(project_id, updated_project, current_user, db)


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT,
               summary="Delete project",
               description="Deletes a project belonging to the authenticated user. Tasks inside the project are also deleted.",
               responses={401: {"description": "Authentication credentials are missing or invalid."},
                          404: {"description": "Project not found."}})
def delete_project(project_id: int, current_user: UserModel = Depends(get_current_user), db: Session = Depends(get_db)):
    delete_project_service(project_id, current_user, db)