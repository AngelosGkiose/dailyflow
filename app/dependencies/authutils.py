from fastapi import  Cookie,Depends, HTTPException
from sqlalchemy.orm.session import Session
from starlette import status

from app.dependencies.db import get_db
from app.models.user_model import UserModel
from app.repositories.user_repository import get_user_by_id
from app.security.security import decode_access_token



def get_current_user(access_token: str | None = Cookie(default=None),db:Session=Depends(get_db))->UserModel:
    credentials_exception = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials")
    if access_token is None:
        raise credentials_exception
    payload=decode_access_token(access_token)
    if payload is None:
        raise credentials_exception
    user_id_value = payload.get("sub")

    if user_id_value is None:
        raise credentials_exception

    try:
        user_id= int(user_id_value)
    except (ValueError, TypeError):
        raise credentials_exception
    if user_id is None:
        raise credentials_exception
    user=get_user_by_id(db,user_id)
    if user is None:
        raise credentials_exception
    return user
