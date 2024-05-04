import os
import uvicorn
import asyncio
from asyncio.windows_events import ProactorEventLoop

from fastapi import FastAPI
from uvicorn import Config, Server
from app import app

port = int(os.environ.get("PORT"))


class ProactorServer(Server):
    def run(self, sockets=None):
        loop = ProactorEventLoop()
        asyncio.set_event_loop(
            loop
        )  # since this is the default in Python 3.10, explicit selection can also be omitted
        asyncio.run(self.serve(sockets=sockets))


config = Config(app=app, host="localhost", port=port, reload=True)

server = Server(config)

if os.name == "nt":
    server = ProactorServer(config=config)


def run():
    server.run()
