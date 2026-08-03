from fastapi import HTTPException
from sqlalchemy.orm.session import Session
from starlette import status

from app.models.label_model import LabelModel
from app.models.user_model import UserModel
from app.repositories.label_repository import get_label_by_name, add_label, get_all_labels_repo
from app.schemas.labels import LabelCreate


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