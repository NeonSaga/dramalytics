from database.connection import get_connection
from fastapi import HTTPException
from psycopg.errors import ForeignKeyViolation, UniqueViolation

def create_review(user_id, review_data):
    connection = get_connection()
    cursor = connection.cursor()

    try:
        cursor.execute(
            """
            INSERT INTO reviews(user_id, drama_id, content)
            VALUES (%s, %s, %s)
            RETURNING id, user_id, drama_id, content, created_at;
            """,
            (
                user_id,
                review_data.drama_id,
                review_data.content
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
            detail="You have already reviewed this drama"
        )

    finally:
        cursor.close()
        connection.close()

    return {
        "id": row[0],
        "user_id": row[1],
        "drama_id": row[2],
        "content": row[3],
        "created_at": row[4]
    }


def get_reviews_from_drama(drama_id):
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT reviews.id, users.username, reviews.content, reviews.created_at
        FROM reviews
        JOIN users
        ON reviews.user_id = users.id
        WHERE reviews.drama_id = %s;
        """,
        (drama_id,)
    )

    rows = cursor.fetchall()

    reviews = []

    for row in rows:
        reviews.append({
            "id": row[0],
            "username": row[1],
            "content": row[2],
            "created_at": row[3]
        })


    cursor.close()
    connection.close()

    return reviews

def update_review(user_id, review_id, review_data):
    connection = get_connection()
    cursor = connection.cursor()

    try:
        cursor.execute(
            """
            UPDATE reviews
            SET content = %s
            WHERE id = %s
            AND user_id = %s
            RETURNING id, user_id, drama_id, content, created_at;
            """,
            (
                review_data.content,
                review_id,
                user_id
            )
        )

        row = cursor.fetchone()

        if row is None:
            connection.rollback()

            raise HTTPException(
                status_code=404,
                detail="Review not found"
            )

        connection.commit()

    finally:
        cursor.close()
        connection.close()

    return {
        "id": row[0],
        "user_id": row[1],
        "drama_id": row[2],
        "content": row[3],
        "created_at": row[4]
    }


def delete_review(user_id, review_id):
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        DELETE FROM reviews
        WHERE id = %s
        AND user_id = %s
        RETURNING id;
        """,
        (
            review_id,
            user_id
        )
    )

    row = cursor.fetchone()

    if row is None:
        connection.rollback()
        cursor.close()
        connection.close()

        raise HTTPException(
            status_code=404,
            detail="Review not found"
        )

    connection.commit()

    cursor.close()
    connection.close()

    return {
        "message": "Review deleted successfully"
    }