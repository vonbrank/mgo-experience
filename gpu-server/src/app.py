
from flask import Flask
from flask_restful import Api

api = Api()


def create_app():
    app = Flask(__name__)

    from routes import hello_world_route

    api.init_app(app)

    return app
