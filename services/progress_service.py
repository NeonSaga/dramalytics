from database.connection import get_connection
from fastapi import HTTPException
from psycopg.errors import ForeignKeyViolation, UniqueViolation, DataError


def create_progress(user_id, progress_data):
    connection = get_connection()
    cursor = connection.cursor()

    try:
        cursor.execute(
            """
            INSERT INTO episode_progress(
                user_id,
                drama_id,
                episode_number
            )
            VALUES (%s, %s, %s)
            RETURNING
                id,
                user_id,
                drama_id,
                episode_number,
                updated_at;
            """,
            (
                user_id,
                progress_data.drama_id,
                progress_data.episode_number
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
            detail="Progress for this drama already exists"
        )

    except DataError:
        connection.rollback()

        raise HTTPException(
            status_code=422,
            detail="Invalid episode progress data"
        )

    finally:
        cursor.close()
        connection.close()

    return {
        "id": row[0],
        "user_id": row[1],
        "drama_id": row[2],
        "episode_number": row[3],
        "updated_at": row[4]
    }


def update_progress(user_id, drama_id, episode_number):
    connection = get_connection()
    cursor = connection.cursor()

    try:
        cursor.execute(
            """
            UPDATE episode_progress
            SET
                episode_number = %s,
                updated_at = CURRENT_TIMESTAMP
            WHERE user_id = %s
            AND drama_id = %s
            RETURNING
                id,
                user_id,
                drama_id,
                episode_number,
                updated_at;
            """,
            (
                episode_number,
                user_id,
                drama_id
            )
        )

        row = cursor.fetchone()

        if row is None:
            connection.rollback()

            raise HTTPException(
                status_code=404,
                detail="Episode progress not found"
            )

        connection.commit()

    except DataError:
        connection.rollback()

        raise HTTPException(
            status_code=422,
            detail="Invalid episode number"
        )

    finally:
        cursor.close()
        connection.close()

    return {
        "id": row[0],
        "user_id": row[1],
        "drama_id": row[2],
        "episode_number": row[3],
        "updated_at": row[4]
    }


def delete_progress(user_id, drama_id):
    connection = get_connection()
    cursor = connection.cursor()

    try:
        cursor.execute(
            """
            DELETE FROM episode_progress
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
                detail="Episode progress not found"
            )

        connection.commit()

    finally:
        cursor.close()
        connection.close()

    return {
        "message": "Episode progress deleted successfully"
    }


def get_progress(user_id, drama_id):
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT id, user_id, drama_id, episode_number, updated_at
        FROM episode_progress
        WHERE user_id = %s
        AND drama_id = %s;
        """,
        (user_id, drama_id)
    )

    row = cursor.fetchone()

    cursor.close()
    connection.close()

    if row is None:
        return None

    return {
        "id": row[0],
        "user_id": row[1],
        "drama_id": row[2],
        "episode_number": row[3],
        "updated_at": row[4]
    }