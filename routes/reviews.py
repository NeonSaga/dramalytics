from fastapi import APIRouter, Depends

from schemas.review_schema import ReviewCreate, ReviewUpdate
from services.review_service import create_review
from utils.auth import get_current_user
from services.review_service import (create_review, get_reviews_from_drama, update_review, delete_review)

router = APIRouter()

@router.post("/reviews")
def add_reviews(
    review: ReviewCreate,
    current_user_id: int = Depends(get_current_user)
):
    return create_review(current_user_id, review)


@router.get("/reviews/{drama_id}")
def get_reviews(drama_id: int):
    return get_reviews_from_drama(drama_id)

@router.patch("/reviews/{review_id}")
def update_review_route(
    review_id: int,
    review: ReviewUpdate,
    current_user_id: int = Depends(get_current_user)
):
    return update_review(current_user_id, review_id, review)


@router.delete("/reviews/{review_id}")
def delete_review_route(
    review_id: int,
    current_user_id: int = Depends(get_current_user)
):
    return delete_review(current_user_id, review_id)