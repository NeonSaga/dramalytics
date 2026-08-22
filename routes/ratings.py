from pydantic import BaseModel

class RatingCreate(BaseModel):
    drama_id: int
    rating: float