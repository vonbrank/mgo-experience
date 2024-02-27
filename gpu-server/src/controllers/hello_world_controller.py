from flask import make_response
from flask_restful import Resource


class HelloWorldController(Resource):
    def get(self):
        return make_response("Python Flask Restful Server", 200)
