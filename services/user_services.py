from database.connection import get_connection
from utils.password import hash_password

def get_all_users():
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        "SELECT id, username, email, created_at FROM users;"
    )

    rows = cursor.fetchall()

    users = []

    for row in rows:
        users.append({
            "id": row[0],
            "username": row[1],
            "email": row[2],
            "created_at": row[3]
        })


    cursor.close()
    connection.close()
    return users

def create_user(user):
    connection = get_connection()
    cursor = connection.cursor()

    hashed_password = hash_password(user.password)

    cursor.execute(
        """
        INSERT INTO users(username, email, password_hash)
        VALUES(%s, %s, %s)
        RETURNING id, username, email, created_at;
        """,
        (user.username, user.email, hashed_password)
    )

    row = cursor.fetchone()

    connection.commit()

    cursor.close()
    connection.close()

    return{
        "id": row[0],
        "username": row[1],
        "email": row[2],
        "created_at": row[3]
    }

def get_user_by_email(email):
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
    """SELECT id, username, password_hash, created_at
        FROM users
        WHERE email = %s;
    """,
    (email,)
    )

    user = cursor.fetchone()

    cursor.close()
    connection.close()

    return user