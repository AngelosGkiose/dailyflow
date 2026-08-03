from datetime import timezone, datetime

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship

from app.database.database import Base
from app.models.task_labels_model import task_labels


class LabelModel(Base):
    __tablename__ = 'labels'
    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "name",
            name="uq_label_user_name"
        ),
    )
    id = Column(Integer, primary_key=True,index=True)
    name = Column(String(50),nullable=False)
    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc)
    )
    user_id=Column(Integer,ForeignKey('users.id'),nullable=False)
    user=relationship("UserModel",back_populates="labels")
    tasks = relationship(
        "TaskModel",
        secondary=task_labels,
        back_populates="labels"
    )