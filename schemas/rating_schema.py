from pydantic import BaseModel, Field

class RatingCreate(BaseModel):
    drama_id: int
    score: float = Field(ge=0, le=10)

class RatingUpdate(BaseModel):
    score: float = Field(ge=0, le=10)