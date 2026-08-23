from fastapi import APIRouter, Depends

from schemas.progress_schema import ProgressCreate, ProgressUpdate
from services.progress_service import (
    create_progress,
    update_progress,
    get_progress
)
from utils.auth import get_current_user


router = APIRouter()


@router.post("/progress")
def add_progress(
    progress: ProgressCreate,
    current_user_id: int = Depends(get_current_user)
):
    return create_progress(current_user_id, progress)


@router.patch("/progress/{drama_id}")
def update_progress_route(
    drama_id: int,
    progress: ProgressUpdate,
    current_user_id: int = Depends(get_current_user)
):
    return update_progress(current_user_id, drama_id, progress)


@router.get("/progress/{drama_id}")
def get_progress_route(
    drama_id: int,
    current_user_id: int = Depends(get_current_user)
):
    return get_progress(current_user_id, drama_id)