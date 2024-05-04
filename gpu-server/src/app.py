from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import hello_world_router, gpu_router
from contextlib import asynccontextmanager
from services.master_server_service import start_master_server_service
from services.gpu_service import (
    start_monitor_gpu_state,
    stop_monitor_gpu_state,
    init_meta_data,
)
from database import Base, engine
import asyncio


@asynccontextmanager
async def lifespan(
    app: FastAPI,
):

    await init_meta_data()

    asyncio.create_task(start_monitor_gpu_state())
    asyncio.create_task(start_master_server_service())

    yield

    await stop_monitor_gpu_state()


Base.metadata.create_all(bind=engine)

app = FastAPI(lifespan=lifespan)

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(hello_world_router)
app.include_router(gpu_router, prefix="/api/v1/gpu")
