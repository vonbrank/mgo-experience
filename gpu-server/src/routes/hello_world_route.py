from controllers import HelloWorldController
from app import api

api.add_resource(HelloWorldController, "/")
print("add_resource")
