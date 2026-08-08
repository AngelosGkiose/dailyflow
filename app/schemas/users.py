from pydantic import BaseModel, Field, EmailStr


class UserCreate(BaseModel):
    username:str = Field(min_length=8 ,max_length=30)
    password:str = Field(min_length=8 ,max_length=128)
    email:EmailStr

class UserResponse(BaseModel):
    id:int
    username:str
    email:EmailStr

    model_config={
        "from_attributes":True
    }

class UserLogin(BaseModel):
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    message: str