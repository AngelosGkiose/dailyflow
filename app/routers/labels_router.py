from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from starlette import status

from app.dependencies.authutils import get_current_user
from app.dependencies.db import get_db
from app.models.user_model import UserModel
from app.schemas.labels import LabelCreate, LabelResponse, LabelUpdate
from app.services.label_service import create_label_service, delete_label_service, get_all_labels_service, get_label_by_id_service, update_label_service

router = APIRouter(prefix="/labels", tags=["Labels"])


@router.post("/", response_model=LabelResponse,
             status_code=status.HTTP_201_CREATED, summary="Create label",
             description="Creates a new label for the authenticated user.",
             responses={401: {"description": "Authentication credentials are missing or invalid."},
                        409: {"description": "A conflicting label already exists."},
                        422: {"description": "The submitted label data is invalid."}})
def create_label(request: LabelCreate, current_user: UserModel = Depends(get_current_user), db: Session = Depends(get_db)):
    return create_label_service(request, current_user, db)


@router.get("/", response_model=list[LabelResponse], status_code=status.HTTP_200_OK,
            summary="List labels", description="Returns all labels belonging to the authenticated user.",
            responses={401: {"description": "Authentication credentials are missing or invalid."}})
def get_all_labels(current_user: UserModel = Depends(get_current_user), db: Session = Depends(get_db)):
    return get_all_labels_service(current_user, db)


@router.get("/{label_id}", response_model=LabelResponse, status_code=status.HTTP_200_OK,
            summary="Get label", description="Returns one label by ID if it belongs to the authenticated user.",
            responses={401: {"description": "Authentication credentials are missing or invalid."},
                       404: {"description": "Label not found."}})
def get_label_by_id(label_id: int, current_user: UserModel = Depends(get_current_user), db: Session = Depends(get_db)):
    return get_label_by_id_service(label_id, current_user, db)


@router.patch("/{label_id}", response_model=LabelResponse, status_code=status.HTTP_200_OK,
              summary="Update label", description="Updates the selected label belonging to the authenticated user.",
              responses={401: {"description": "Authentication credentials are missing or invalid."},
                         404: {"description": "Label not found."},
                         422: {"description": "The submitted label data is invalid."}})
def update_label(request: LabelUpdate, label_id: int, current_user: UserModel = Depends(get_current_user), db: Session = Depends(get_db)):
    return update_label_service(request, label_id, current_user, db)


@router.delete("/{label_id}", status_code=status.HTTP_204_NO_CONTENT,
               summary="Delete label",
               description="Deletes a label belonging to the authenticated user. Tasks using the label are not deleted.",
               responses={401: {"description": "Authentication credentials are missing or invalid."},
                          404: {"description": "Label not found."}})
def delete_label(label_id: int, current_user: UserModel = Depends(get_current_user), db: Session = Depends(get_db)):
    delete_label_service(label_id, current_user, db)