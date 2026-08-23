from pydantic import BaseModel, Field


class ProgressCreate(BaseModel):
    drama_id: int
    episode_number: int = Field(ge=1)


class ProgressUpdate(BaseModel):
    episode_number: int = Field(ge=1)