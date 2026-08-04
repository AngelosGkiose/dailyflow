from fastapi import Depends, HTTPException
from sqlalchemy.orm.session import Session
from starlette import status

from app.dependencies.db import get_db
from app.models.user_model import UserModel
from app.repositories.user_repository import get_user_by_id
from app.security.security import decode_access_token

from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login"
)

def get_current_user(token:str=Depends(oauth2_scheme),db:Session=Depends(get_db()))->UserModel:
    credentials_exception = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={
            "WWW-Authenticate": "Bearer"
        })
    payload=decode_access_token(token)
    if payload is None:
        raise credentials_exception
    try:
        user_id=int(payload.get("sub"))
    except (ValueError, TypeError):
        raise credentials_exception
    if user_id is None:
        raise credentials_exception
    user=get_user_by_id(db,user_id)
    if user is None:
        raise credentials_exception
    return user
