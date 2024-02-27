from dotenv import load_dotenv
from app import create_app
import os

load_dotenv()

port = int(os.environ.get("PORT"))


def run():
    app = create_app()
    app.run(port=port, debug=True)
