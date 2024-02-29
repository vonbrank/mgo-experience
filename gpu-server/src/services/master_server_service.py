import os
import httpx
import asyncio
from sqlalchemy.orm import Session
from services import setting_service
from models import Setting
from schemas import setting_schema
from database import get_db
from contextlib import contextmanager

master_server_host = os.environ.get("MASTER_SERVER_HOST")
master_server_port = int(os.environ.get("MASTER_SERVER_PORT"))

base_url: str = "/api/v1/gpus"


async def start_master_server_service():
    with contextmanager(get_db)() as db:
        await init_master_server_connection(db)

    await heart_beat()


async def init_master_server_connection(db: Session):

    gpuIdSetting: Setting | None = setting_service.get_setting(db, "gpu-id")

    if gpuIdSetting is None:
        await register_self(db)
    else:
        await start_up_connection(gpuIdSetting.value)


async def register_self(db: Session):
    url = f"http://{master_server_host}:{master_server_port}{base_url}/register"
    data = {
        "host": master_server_host,
        "port": master_server_port,
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(url=url, json=data)
        if response.status_code == 201:
            result = response.json()
            data = result["data"]
            setting_service.create_setting(
                db, setting_schema.SettingCreate(key="gpu-id", value=data["_id"])
            )


async def start_up_connection(gpu_id: str):
    url = f"http://{master_server_host}:{master_server_port}{base_url}/startup"
    data = {
        "gpu-id": gpu_id,
        "host": master_server_host,
        "port": master_server_port,
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(url=url, json=data)
        if response.status_code == 200:
            result = response.json()
            print(f"start up result: {result}")


async def heart_beat():
    while True:
        await asyncio.sleep(15)
        print("Heart Beat...")


def shut_down_connection():
    pass
