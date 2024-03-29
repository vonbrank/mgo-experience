from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import hello_world_router, gpu_router
from contextlib import asynccontextmanager
from services.master_server_service import start_master_server_service
from services.gpu_service import monitor_gpu_state
from database import Base, engine
import asyncio


@asynccontextmanager
async def lifespan(
    app: FastAPI,
):
    asyncio.create_task(monitor_gpu_state())
    asyncio.create_task(start_master_server_service())

    yield


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
