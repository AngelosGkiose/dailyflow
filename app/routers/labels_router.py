from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from starlette import status

from app.dependencies.authutils import get_current_user
from app.dependencies.db import get_db
from app.models.user_model import UserModel
from app.schemas.labels import LabelResponse, LabelCreate, LabelUpdate
from app.services.label_service import create_label_service, get_all_labels_service, get_label_by_id_service, \
    update_label_service, delete_label_service

router = APIRouter(prefix="/labels", tags=["labels"])

@router.post("/",response_model=LabelResponse,status_code=status.HTTP_201_CREATED)
def create_label(request:LabelCreate,current_user:UserModel=Depends(get_current_user),db:Session=Depends(get_db)):
    return create_label_service(request,current_user,db)

@router.get("/",response_model=list[LabelResponse],status_code=status.HTTP_200_OK)
def get_all_labels(current_user:UserModel=Depends(get_current_user),db:Session=Depends(get_db)):
    return get_all_labels_service(current_user,db)

@router.get("/{label_id}",response_model=LabelResponse,status_code=status.HTTP_200_OK)
def get_label_by_id(label_id:int,current_user:UserModel=Depends(get_current_user),db:Session=Depends(get_db)):
    return get_label_by_id_service(label_id,current_user,db)

@router.patch("/{label_id}",response_model=LabelResponse,status_code=status.HTTP_200_OK)
def update_label(request:LabelUpdate,label_id:int,current_user:UserModel=Depends(get_current_user),db:Session=Depends(get_db)):
    return update_label_service(request,label_id,current_user,db)

@router.delete("/{label_id}",status_code=status.HTTP_204_NO_CONTENT)
def delete_label(label_id:int,current_user:UserModel=Depends(get_current_user),db:Session=Depends(get_db)):
    delete_label_service(label_id,current_user,db)
