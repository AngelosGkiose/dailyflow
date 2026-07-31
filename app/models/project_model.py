from datetime import datetime, timezone

from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from app.database.database import Base


class ProjectModel(Base):
    __tablename__ = 'project'
    id = Column(Integer, primary_key=True,index=True)
    name = Column(String(100),nullable=False)
    description = Column(String(500),nullable=True)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    )

    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    tasks = relationship(
        "TaskModel",
        back_populates="project"
    )

    user = relationship("UserModel", back_populates="projects")
