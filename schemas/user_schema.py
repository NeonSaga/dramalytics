from pydantic import BaseModel
from datetime import datetime


class UserResponse(BaseModel):
    id: int 
    username: str 
    email: str
    created_at: datetime


class UserCreate(BaseModel):
    username: str
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str