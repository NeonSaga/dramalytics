from clients.mdl_client import search_dramas, get_drama
from database.connection import get_connection


def search_drama(query):
    return search_dramas(query)

def get_drama_details(slug):
    return get_drama(slug)

def save_drama(slug):
    drama = get_drama(slug)

    drama_id = int(slug.split("-")[0])

    title = drama["title"]

    if"(" in title:
        title = title.rsplit("(", 1)[0].strip()

    aired = drama.get("aired")
    release_year = None

    if aired:
        release_year = int(aired[-4:])

    poster_url = drama.get("image")

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT id, title, release_year, poster_url, slug
        FROM dramas
        WHERE id = %s;
        """,
        (drama_id,)
    )

    existing_drama = cursor.fetchone()

    if existing_drama:
        cursor.close()
        connection.close()


        return { 
             "id": existing_drama[0],
            "title": existing_drama[1],
            "release_year": existing_drama[2],
            "poster_url": existing_drama[3],
            "slug": existing_drama[4]
        }

    
    cursor.execute(
        """
        INSERT INTO dramas(id, title, release_year, poster_url, slug)
        VALUES (%s, %s, %s, %s, %s)
        RETURNING id, title, release_year, poster_url, slug;
        """,
        (
            drama_id,
            title,
            release_year,
            poster_url,
            slug
        )
    )

    row = cursor.fetchone()

    connection.commit()

    cursor.close()
    connection.close()

    return {
        "id": row[0],
        "title": row[1],
        "release_year": row[2],
        "poster_url": row[3],
        "slug": row[4]
    }