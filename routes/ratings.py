from fastapi import APIRouter, Depends
from schemas.rating_schema import RatingCreate, RatingUpdate
from services.rating_service import create_rating, get_ratings_for_drama, update_rating, delete_rating
from utils.auth import get_current_user
from typing import Annotated
from fastapi import Path

router = APIRouter()

@router.post("/ratings")
def add_rating(
    rating: RatingCreate,
    current_user_id: int = Depends(get_current_user)
):
    return create_rating(current_user_id, rating)

@router.get("/ratings/{drama_id}")
def get_ratings(drama_id: Annotated[int, Path(ge=1, le=2147483647)]):
    return get_ratings_for_drama(drama_id)

@router.patch("/ratings/{drama_id}")
def update_rating_route(
    drama_id: Annotated[int, Path(ge=1, le=2147483647)],
    rating: RatingUpdate,
    current_user_id: int = Depends(get_current_user)
):
    return update_rating(current_user_id, drama_id, rating)

@router.delete("/ratings/{drama_id}")
def delete_rating_route(
    drama_id: Annotated[int, Path(ge=1, le=2147483647)],
    current_user_id: int = Depends(get_current_user)
):
    return delete_rating(current_user_id, drama_id)