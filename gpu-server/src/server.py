
import os
from models import Setting
from app import create_app, db
from dotenv import load_dotenv
load_dotenv()

port = int(os.environ.get("PORT"))


def run():
    app = create_app()

    with app.app_context():
        db.create_all()
        from services import master_server_service
        master_server_service.start_up_connection()

    app.run(port=port, debug=True)
