from datetime import datetime

from pydantic import BaseModel, Field


class ProjectCreate(BaseModel):
    name:str = Field(min_length=1,max_length=100,required=True)
    description: str | None = None





class ProjectResponse(BaseModel):
    id: int
    name: str
    description: str | None
    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True
    }

class ProjectUpdate(BaseModel):
    name: str | None = Field(
        default=None,
        min_length=1,
        max_length=100
    )
    description: str | None = None

