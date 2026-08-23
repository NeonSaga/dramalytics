from database.connection import get_connection
from fastapi import HTTPException
from psycopg.errors import ForeignKeyViolation, UniqueViolation

def create_rating(user_id, rating_data):
    connection = get_connection()
    cursor = connection.cursor()

    try:
        cursor.execute(
            """
            INSERT INTO ratings(user_id, drama_id, score)
            VALUES (%s, %s, %s)
            RETURNING id, user_id, drama_id, score;
            """,
            (
                user_id,
                rating_data.drama_id,
                rating_data.score
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
            detail="You have already rated this drama"
        )

    finally:
        cursor.close()
        connection.close()

    return {
        "id": row[0],
        "user_id": row[1],
        "drama_id": row[2],
        "score": row[3]
    }

def get_ratings_for_drama(drama_id):
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT id, user_id, drama_id, score
        FROM ratings
        WHERE drama_id = %s;
        """,
        (drama_id,)
    )

    rows = cursor.fetchall()

    ratings = []

    for row in rows:
        ratings.append({
            "id": row[0],
            "user_id": row[1],
            "drama_id": row[2],
            "score": row[3]
        })



    cursor.close()
    connection.close()

    return ratings

def update_rating(user_id, drama_id, rating_data):
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        UPDATE ratings
        SET score = %s
        WHERE user_id = %s AND drama_id = %s
        RETURNING id, user_id, drama_id, score;
        """,
        (
            rating_data.score,
            user_id,
            drama_id
        )
    )

    row = cursor.fetchone()

    connection.commit()

    cursor.close()
    connection.close()

    return {
        "id": row[0],
        "user_id": row[1],
        "drama_id": row[2],
        "score": row[3]
    }

def delete_rating(user_id, drama_id):
    connection = get_connection()
    cursor = connection.cursor()

    try:
        cursor.execute(
            """
            DELETE FROM ratings
            WHERE user_id = %s
            AND drama_id = %s
            RETURNING id, user_id, drama_id, score;
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
                detail="Rating not found"
            )

        connection.commit()

    finally:
        cursor.close()
        connection.close()

    return {
        "id": row[0],
        "user_id": row[1],
        "drama_id": row[2],
        "score": row[3]
    }