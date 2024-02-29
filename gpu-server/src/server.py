
import os
import uvicorn
from dotenv import load_dotenv
load_dotenv()

port = int(os.environ.get("PORT"))


def run():
    uvicorn.run("app:app", host="localhost", port=port, reload=True)
