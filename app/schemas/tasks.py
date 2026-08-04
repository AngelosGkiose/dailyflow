from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field

from app.models.task_model import TaskPriority, TaskStatus
from app.schemas.labels import LabelResponse


class TaskSortBy(str, Enum):
    CREATED_AT = "created_at"
    UPDATED_AT = "updated_at"
    DUE_DATE = "due_date"
    TITLE = "title"
    PRIORITY = "priority"


class SortOrder(str, Enum):
    ASC = "asc"
    DESC = "desc"

class TaskPaginationResponse(BaseModel):
    items: list[TaskResponse]
    page: int
    page_size: int
    total: int
    total_pages: int

class TaskCreate(BaseModel):
    title: str = Field(
        min_length=1,
        max_length=100
    )

    description: str | None = Field(
        default=None,
        max_length=500
    )

    priority: TaskPriority

    due_date: datetime | None = None
    project_id: int | None = None


class TaskResponse(BaseModel):
    id: int
    title: str
    description: str | None
    status: TaskStatus
    priority: TaskPriority
    due_date: datetime | None
    created_at: datetime
    updated_at: datetime
    completed_at: datetime | None
    project_id: int | None
    labels: list[LabelResponse] = Field(default_factory=list)

    model_config = {
        "from_attributes": True
    }



class TaskUpdate(BaseModel):
    title: str | None = Field(
        default=None,
        min_length=1,
        max_length=100
    )

    description: str | None = Field(
        default=None,
        max_length=500
    )

    priority: TaskPriority | None = None

    due_date: datetime | None = None
    project_id: int | None = None