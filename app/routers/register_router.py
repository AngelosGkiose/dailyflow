from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm.session import Session
from starlette import status

from app.config import settings
from app.dependencies.authutils import get_current_user
from app.dependencies.db import get_db
from app.models.user_model import UserModel
from app.schemas.users import LoginResponse, UserCreate, UserLogin, UserResponse
from app.services.auth_service import login_user, register_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED,
             summary="Register user", description="Creates a new DailyFlow user account. Email addresses must be unique.",
             responses={409: {"description": "Email is already registered."},
                        422: {"description": "The submitted registration data is invalid."}})
def register(user: UserCreate, db: Session = Depends(get_db)):
    return register_user(user, db)


@router.post("/login", response_model=LoginResponse, status_code=status.HTTP_200_OK,
             summary="Login user", description="Authenticates a user using email and password. On success, the access token is stored in an HttpOnly cookie.",
             responses={401: {"description": "Invalid email or password."},
                        422: {"description": "The submitted login data is invalid."}})
def login(login_data: UserLogin, response: Response, db: Session = Depends(get_db)):
    access_token = login_user(login_data, db)
    response.set_cookie(key="access_token", value=access_token, httponly=True, secure=False, samesite="lax", max_age=settings.expiration_time * 60, path="/")
    return {"message": "Login successful"}


@router.post("/logout", status_code=status.HTTP_200_OK, summary="Logout user", description="Logs out the current browser session by deleting the HttpOnly access token cookie.")
def logout(response: Response):
    response.delete_cookie(key="access_token", path="/")
    return {"message": "Logout successful"}


@router.get("/me", response_model=UserResponse, status_code=status.HTTP_200_OK,
            summary="Get current user", description="Returns the currently authenticated user using the HttpOnly authentication cookie.",
            responses={401: {"description": "Authentication credentials are missing or invalid."}})
def get_me(current_user: UserModel = Depends(get_current_user)):
    return current_user