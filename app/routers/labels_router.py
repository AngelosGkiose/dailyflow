from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from starlette import status

from app.dependencies.authutils import get_current_user
from app.dependencies.db import get_db
from app.models.user_model import UserModel
from app.schemas.labels import LabelResponse, LabelCreate
from app.services.label_service import create_label_service, get_all_labels_service

router = APIRouter(prefix="/labels", tags=["labels"])

@router.post("/",response_model=LabelResponse,status_code=status.HTTP_201_CREATED)
def create_label(request:LabelCreate,current_user:UserModel=Depends(get_current_user),db:Session=Depends(get_db)):
    return create_label_service(request,current_user,db)

@router.get("/",response_model=list[LabelResponse],status_code=status.HTTP_200_OK)
def get_all_labels(current_user:UserModel=Depends(get_current_user),db:Session=Depends(get_db)):
    return get_all_labels_service(current_user,db)

