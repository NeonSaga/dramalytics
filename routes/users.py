from fastapi import APIRouter
from services.user_services import get_all_users, create_user
from schemas.user_schema import UserResponse, UserCreate

router = APIRouter()

@router.get("/users", response_model=list[UserResponse])
def get_users():
    return get_all_users()

@router.post("/users", response_model=UserResponse)
def create_new_user(user: UserCreate):
    return create_user(user)