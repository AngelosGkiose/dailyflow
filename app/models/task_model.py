from sqlalchemy import Column, Integer, String, Enum, DateTime, ForeignKey

from app.database.database import Base

class TaskStatus(str, Enum):
    PENDING = "pending"
    COMPLETED = "completed"

class Priority(str,Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class TaskModel(Base):
    __tablename__ = "task"
    id =Column(Integer,primary_key=True,index=True)
    title=Column(String,nullable=False)
    description=Column(String,nullable=True)
    status=Column(Enum(TaskStatus),nullable=True,default=TaskStatus.PENDING)
    priority=Column(Enum(Priority),nullable=False)
    due_date=Column(DateTime,nullable=True)
    created_at=Column(DateTime,nullable=True)
    updated_at=Column(DateTime,nullable=True)
    completed_at=Column(DateTime,nullable=True)
    user_id=Column(Integer,ForeignKey("user.id"),nullable=False)
    user=relationship("UserModel",back_populates="tasks")
