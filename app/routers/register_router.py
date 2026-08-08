from fastapi import (
    APIRouter,
    Depends,
    Response
)

from sqlalchemy.orm.session import Session
from starlette import status

from app.config import settings
from app.dependencies.authutils import (
    get_current_user
)
from app.dependencies.db import get_db
from app.models.user_model import UserModel
from app.schemas.users import (
    LoginResponse,
    UserCreate,
    UserLogin,
    UserResponse
)
from app.services.auth_service import (
    login_user,
    register_user
)


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post("/register",response_model=UserResponse,status_code=status.HTTP_201_CREATED)
def register(user: UserCreate,db: Session = Depends(get_db)):
    return register_user(user,db)


@router.post("/login",response_model=LoginResponse,status_code=status.HTTP_200_OK)
def login(login_data: UserLogin, response: Response,db: Session = Depends(get_db)):
    access_token = login_user(login_data,db)
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=(
            settings.expiration_time
            * 60
        ),
        path="/"
    )
    return {"message": "Login successful"}


@router.post("/logout",status_code=status.HTTP_200_OK)
def logout(response: Response):
    response.delete_cookie(
        key="access_token",
        path="/"
    )
    return {"message": "Logout successful"}


@router.get("/me",response_model=UserResponse,status_code=status.HTTP_200_OK)
def get_me(current_user: UserModel = Depends(get_current_user)):
    return current_user