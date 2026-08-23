from database.connection import get_connection
from fastapi import HTTPException
from psycopg.errors import ForeignKeyViolation, UniqueViolation

def create_watchlist(user_id, watchlist_data):
    connection = get_connection()
    cursor = connection.cursor()

    try:
        cursor.execute(
            """
            INSERT INTO watchlist(user_id, drama_id, status)
            VALUES (%s, %s, %s)
            RETURNING id, user_id, drama_id, status;
            """,
            (
                user_id,
                watchlist_data.drama_id,
                watchlist_data.status
            )
        )

        row = cursor.fetchone()

        connection.commit()

    except ForeignKeyViolation:
        connection.rollback()

        raise HTTPException(
            status_code=404,
            detail="Drama not found"
        )

    except UniqueViolation:
        connection.rollback()

        raise HTTPException(
            status_code=409,
            detail="This drama is already in your watchlist"
        )

    finally:
        cursor.close()
        connection.close()

    return {
        "id": row[0],
        "user_id": row[1],
        "drama_id": row[2],
        "status": row[3]
    }

def update_watchlist(user_id, drama_id, status):
    connection = get_connection()
    cursor = connection.cursor()

    try:
        cursor.execute(
            """
            UPDATE watchlist
            SET status = %s
            WHERE user_id = %s
            AND drama_id = %s
            RETURNING id, user_id, drama_id, status;
            """,
            (
                status,
                user_id,
                drama_id
            )
        )

        row = cursor.fetchone()

        if row is None:
            connection.rollback()

            raise HTTPException(
                status_code=404,
                detail="Watchlist item not found"
            )

        connection.commit()

    finally:
        cursor.close()
        connection.close()

    return {
        "id": row[0],
        "user_id": row[1],
        "drama_id": row[2],
        "status": row[3]
    }


def delete_watchlist(user_id, drama_id):
    connection = get_connection()
    cursor = connection.cursor()

    try:
        cursor.execute(
            """
            DELETE FROM watchlist
            WHERE user_id = %s
            AND drama_id = %s
            RETURNING id;
            """,
            (
                user_id,
                drama_id
            )
        )

        row = cursor.fetchone()

        if row is None:
            connection.rollback()

            raise HTTPException(
                status_code=404,
                detail="Watchlist item not found"
            )

        connection.commit()

    finally:
        cursor.close()
        connection.close()

    return {
        "message": "Watchlist item deleted successfully"
    }

def get_watchlist(user_id):
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT watchlist.id, dramas.title, dramas.poster_url, watchlist.status
        FROM watchlist
        JOIN dramas
        ON watchlist.drama_id = dramas.id
        WHERE watchlist.user_id = %s;
        """,
        (user_id,)
    )

    rows = cursor.fetchall()

    watchlist = []

    for row in rows:
        watchlist.append({
            "id": row[0],
            "title": row[1],
            "poster_url": row[2],
            "status": row[3]
           })

    cursor.close()
    connection.close()

    return watchlist

