import os 
from datetime import datetime, timedelta, timezone

import jwt
from dotenv import load_dotenv

load_dotenv()

JWT_SECRET = os.environ["JWT_SECRET"]
JWT_ALGORITHM = 'HS256'


def create_access_token(user_id: int):
    expiration = datetime.now(timezone.utc) + timedelta(hours = 24)

    payload = {
        "sub": str(user_id),
        "exp": expiration
    }

    token = jwt.encode(
        payload,
        JWT_SECRET ,
        algorithm=JWT_ALGORITHM
    )

    return token 



def decode_access_token(token):
    payload = jwt.decode(
        token,
        JWT_SECRET,
        algorithms=[JWT_ALGORITHM]
    )

    return payload