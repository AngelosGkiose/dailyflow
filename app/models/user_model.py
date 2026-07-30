from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from app.database.database import Base


class UserModel(Base):
    __tablename__="users"
    id = Column(Integer,primary_key=True,index=True)
    username = Column(String,nullable=False)
    email =Column(String,unique=True,nullable=False)
    hashed_password = Column(String,nullable=False)
    role =Column(String,nullable=False,default="user")

    tasks = relationship(
        "TaskModel",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    projects = relationship("ProjectModel", back_populates="user",cascade="all, delete-orphan")
