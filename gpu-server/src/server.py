
import os
import uvicorn

port = int(os.environ.get("PORT"))


def run():
    uvicorn.run("app:app", host="localhost", port=port, reload=True)
