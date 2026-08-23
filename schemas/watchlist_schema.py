from pydantic import BaseModel

class WatchlistCreate(BaseModel):
    drama_id: int
    status: str

class WatchlistUpdate(BaseModel):
    status: str