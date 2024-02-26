from flask import Flask, make_response
from flask_restful import Api, Resource
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
port = int(os.environ.get("PORT"))
api = Api(app)


class HelloWorld(Resource):
    def get(self):
        return make_response("Python Flask Restful Server", 200)


api.add_resource(HelloWorld, "/")

if __name__ == "__main__":
    app.run(port=port, debug=True)
