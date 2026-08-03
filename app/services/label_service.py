from fastapi import HTTPException
from sqlalchemy.orm.session import Session
from starlette import status

from app.models.label_model import LabelModel
from app.models.user_model import UserModel
from app.repositories.label_repository import get_label_by_name, add_label, get_all_labels_repo, get_label_by_id_repo, \
    update_label_repo, delete_label_repo
from app.schemas.labels import LabelCreate, LabelUpdate


def create_label_service(request:LabelCreate,current_user:UserModel,db:Session):
    name=request.name.lower().strip()
    if not name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Label name cannot be empty"
        )
    existing_label=get_label_by_name(db, current_user.id, name)
    if existing_label is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,detail="Label with that name already exists")
    label=LabelModel(
        name=name,user_id=current_user.id
    )
    return add_label(db,label)


def get_all_labels_service(current_user:UserModel,db:Session):
    return get_all_labels_repo(db,current_user.id)

def get_label_by_id_service(label_id:int,current_user:UserModel,db:Session):
    label= get_label_by_id_repo(db,label_id,current_user.id)
    if label is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Label not found")
    return label

def update_label_service(request:LabelUpdate,label_id:int,current_user:UserModel,db:Session):
    label=get_label_by_id_repo(db,label_id,current_user.id)
    if label is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Label not found")
    if request.name is not None:
        new_label_name = request.name.strip().lower()
        if not new_label_name:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Label name cannot be empty"
            )
        existing_label=get_label_by_name(db, current_user.id, new_label_name)
        if existing_label is not None and existing_label.id != label.id:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT,detail="Label with that name already exists")
        label.name=new_label_name
    return update_label_repo(db, label)

def delete_label_service(label_id:int,current_user:UserModel,db:Session):
    label=get_label_by_id_repo(db,label_id,current_user.id)
    if label is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Label not found")
    delete_label_repo(db, label)

