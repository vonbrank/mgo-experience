from fastapi import FastAPI
from routes import hello_world_router
from contextlib import asynccontextmanager
from services.master_server_service import start_master_server_service
from database import Base, engine
import asyncio


@asynccontextmanager
async def lifespan(
    app: FastAPI,
):

    asyncio.create_task(start_master_server_service())

    yield


Base.metadata.create_all(bind=engine)

app = FastAPI(lifespan=lifespan)


app.include_router(hello_world_router)
