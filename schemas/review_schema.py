from pydantic import BaseModel, Field

class ReviewCreate(BaseModel):
    drama_id: int = Field(ge=1, le=2147483647)
    content: str

class ReviewUpdate(BaseModel):
    content: str