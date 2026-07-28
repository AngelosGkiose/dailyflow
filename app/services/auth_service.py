from fastapi import HTTPException
from sqlalchemy.orm.session import Session
from starlette import status

from app.models.user_model import UserModel
from app.repositories.user_repository import get_user_by_email, add_user
from app.schemas.users import UserCreate, UserLogin
from app.security.security import hash_password, verify_password, create_access_token


def register_user(user_data:UserCreate,db:Session)->UserModel:
    existing_email=get_user_by_email(db, user_data.email)
    if existing_email is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,detail="Email already registered")
    new_user=UserModel(username=user_data.username, email=user_data.email, hashed_password=hash_password(user_data.password))
    return add_user(db, new_user)

def authenticate_user(
    email: str,
    password: str,
    db: Session
) -> UserModel | None:
    user = get_user_by_email(db, email)

    if user is None:
        return None

    if not verify_password(
        password,
        user.hashed_password
    ):
        return None

    return user

def login_user(login_data:UserLogin,db: Session):
    user = authenticate_user(login_data.email, login_data.password, db)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={
                "WWW-Authenticate": "Bearer"
            }
        )
    access_token=create_access_token(data={"sub": str(user.id)})

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


