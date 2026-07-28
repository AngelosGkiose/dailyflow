

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm.session import Session
from starlette import status

from app.dependencies.db import get_db
from app.schemas.users import UserResponse, UserCreate, UserLogin, TokenResponse
from app.services.auth_service import register_user, authenticate_user, login_user

router=APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)



@router.post("/register",response_model=UserResponse,status_code=status.HTTP_201_CREATED)
def register(user:UserCreate,db: Session=Depends(get_db)):
    return register_user(user, db)

@router.post("/login",response_model=TokenResponse,status_code=status.HTTP_200_OK)
def login(login_data:UserLogin,db: Session = Depends(get_db)):
    return login_user(login_data, db)





