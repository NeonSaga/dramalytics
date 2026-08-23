from pydantic import BaseModel

class ReviewCreate(BaseModel):
    drama_id: int
    content: str

class ReviewUpdate(BaseModel):
    content: str