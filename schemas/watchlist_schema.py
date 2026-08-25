from pydantic import BaseModel, Field

class WatchlistCreate(BaseModel):
    drama_id: int = Field(ge=1, le=2147483647)
    status: str

class WatchlistUpdate(BaseModel):
    status: str | None = None
    episodes_watched: int | None = Field(default=None, ge=0)