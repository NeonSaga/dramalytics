from fastapi import APIRouter, Depends, Path
from typing import Annotated
from schemas.watchlist_schema import WatchlistCreate, WatchlistUpdate
from services.watchlist_service import create_watchlist, update_watchlist, get_watchlist, delete_watchlist
from utils.auth import get_current_user

router = APIRouter()

@router.post("/watchlist")
def add_to_watchlist(watchlist: WatchlistCreate, current_user_id: int = Depends(get_current_user)):
    return create_watchlist(current_user_id, watchlist)


@router.patch("/watchlist/{drama_id}")
def update_watchlist_status(
    drama_id: Annotated[int, Path(ge=1, le=2147483647)], 
    watchlist: WatchlistUpdate,
    current_user_id: int = Depends(get_current_user)
):
    return update_watchlist(current_user_id, drama_id, watchlist.status)

@router.get("/watchlist")
def get_my_watchlist(
    current_user_id: int =Depends(get_current_user)
):
    return get_watchlist(current_user_id)

@router.delete("/watchlist/{drama_id}")
def remove_from_watchlist(
    drama_id: int,
    current_user_id: int = Depends(get_current_user)
):
    return delete_watchlist(current_user_id, drama_id)