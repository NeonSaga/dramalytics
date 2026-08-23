import requests


BASE_URL = "https://my-drama-list-api-ten.vercel.app"


def search_dramas(query):
    response = requests.get(
        f"{BASE_URL}/api/search/q/{query}"
    )

    response.raise_for_status()

    return response.json()


def get_drama(slug):
    response = requests.get(
        f"{BASE_URL}/api/id/{slug}"
    )

    response.raise_for_status()

    return response.json()