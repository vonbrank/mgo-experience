import asyncio
import time
from services.jstp_client_service import fetch

if __name__ == "__main__":
    asyncio.run(fetch(url="helloworld", payload={"data": "Hello world."}))
