from datetime import datetime, timezone
from enum import Enum

from sqlalchemy import (
    Column,
    DateTime,
    Enum as SqlEnum,
    ForeignKey,
    Integer,
    String
)
from sqlalchemy.orm import relationship

from app.database.database import Base


class TaskStatus(str, Enum):
    PENDING = "pending"
    COMPLETED = "completed"


class TaskPriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class TaskModel(Base):
    __tablename__ = "tasks"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    title = Column(
        String(100),
        nullable=False
    )

    description = Column(
        String(500),
        nullable=True
    )

    status = Column(
        SqlEnum(TaskStatus),
        nullable=False,
        default=TaskStatus.PENDING
    )

    priority = Column(
        SqlEnum(TaskPriority),
        nullable=False
    )

    due_date = Column(
        DateTime(timezone=True),
        nullable=True
    )

    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc)
    )

    updated_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )

    completed_at = Column(
        DateTime(timezone=True),
        nullable=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    user = relationship(
        "UserModel",
        back_populates="tasks"
    )