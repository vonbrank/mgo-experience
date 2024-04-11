import jwt

publicKey: str | None = None

JWT_ALGORITHM = "ES256"


def savePublickKey(newPublickKey: str):
    global publicKey
    publicKey = newPublickKey

def verify(token) -> dict | None:
    
    try:
        payload = jwt.decode(token, publicKey, algorithms=[JWT_ALGORITHM])
    except jwt.PyJWTError:
        return None
    else:
        return payload