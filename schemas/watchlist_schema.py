from pydantic import BaseModel, Field

class WatchlistCreate(BaseModel):
    drama_id: int = Field(ge=1, le=2147483647)
    status: str

class WatchlistUpdate(BaseModel):
    status: str