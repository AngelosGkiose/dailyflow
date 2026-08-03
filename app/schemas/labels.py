from datetime import datetime

from pydantic import BaseModel, Field


class LabelCreate(BaseModel):
    name: str = Field(
        min_length=1,
        max_length=50
    )

class LabelUpdate(BaseModel):
    name: str | None = Field(
        default=None,
        min_length=1,
        max_length=50
    )

class LabelResponse(BaseModel):
    id: int
    name: str
    created_at: datetime

    model_config = {
        "from_attributes": True
    }