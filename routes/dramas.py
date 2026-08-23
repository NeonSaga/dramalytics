from fastapi import APIRouter, Query

from services.drama_service import search_drama, get_drama_details, save_drama

router = APIRouter()

@router.get("/dramas/search")
def search_dramas_route(
    q: str = Query(min_length=1)
):
    return search_drama(q)

@router.get("/dramas/{slug}")
def get_drama_route(slug: str):
    return get_drama_details(slug)

@router.post("/dramas/{slug}/save")
def save_drama_route(slug: str):
    return save_drama(slug)