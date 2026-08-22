from fastapi import APIRouter, HTTPException

from schemas.user_schema import UserLogin
from services.user_services import get_user_by_email
from utils.password import verify_password
from utils.jwt import create_access_token
from utils.jwt import decode_access_token
from fastapi import Depends
from utils.auth import get_current_user


router = APIRouter()

@router.post("/login")
def login(user: UserLogin):
    database_user = get_user_by_email(user.email)

    if database_user is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    password_correct = verify_password(
        user.password,
        database_user[2]
    )

    if not password_correct:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    token = create_access_token(database_user[0])

    return{
        "access_token": token,
        "token_type": "bearer"
    }


@router.get("/me")
def get_my_user(current_user_id: int = Depends(get_current_user)):
    return{
        "user_id": current_user_id
    }