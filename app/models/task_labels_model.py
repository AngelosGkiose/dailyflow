from sqlalchemy import Table, Column, Integer, ForeignKey

from app.database.database import Base


task_labels = Table(
    "task_labels",
    Base.metadata,

    Column(
        "task_id",
        Integer,
        ForeignKey("tasks.id"),
        primary_key=True
    ),

    Column(
        "label_id",
        Integer,
        ForeignKey("labels.id"),
        primary_key=True
    )
)