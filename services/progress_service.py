from database.connection import get_connection


def create_progress(user_id, progress_data):
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        INSERT INTO episode_progress(
            user_id,
            drama_id,
            episode_number
        )
        VALUES (%s, %s, %s)
        RETURNING id, user_id, drama_id, episode_number, updated_at;
        """,
        (
            user_id,
            progress_data.drama_id,
            progress_data.episode_number
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
        "episode_number": row[3],
        "updated_at": row[4]
    }


def update_progress(user_id, drama_id, progress_data):
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        UPDATE episode_progress
        SET episode_number = %s,
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = %s
        AND drama_id = %s
        RETURNING id, user_id, drama_id, episode_number, updated_at;
        """,
        (
            progress_data.episode_number,
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
        "episode_number": row[3],
        "updated_at": row[4]
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