import os
import httpx
import asyncio
from sqlalchemy.orm import Session
from services import setting_service, auth_service
from models import Setting
from schemas import setting_schema, master_server_schema
from database import get_db
from contextlib import contextmanager

master_server_host = os.environ.get("MASTER_SERVER_HOST")
master_server_port = int(os.environ.get("MASTER_SERVER_PORT"))
master_server_service_mode = os.environ.get("MASTER_SERVER_SERVICE_MODE")

gpu_server_host = os.environ.get("GPU_SERVER_HOST")
gpu_server_port = int(os.environ.get("GPU_SERVER_PORT"))

base_url: str = "/api/v1/gpus"


async def start_master_server_service():
    with contextmanager(get_db)() as db:
        await init_master_server_connection(db)

    await heart_beat(db)


async def init_master_server_connection(db: Session):

    if master_server_service_mode == "FAKE_CONNECTION":
        return

    gpuIdSetting: Setting | None = setting_service.get_setting(db, "gpu-id")

    if gpuIdSetting is None:
        await register_self(db)
    else:
        await start_up_connection(gpuIdSetting.value)


async def register_self(db: Session):
    url = f"http://{master_server_host}:{master_server_port}{base_url}/register"
    data = {
        "host": gpu_server_host,
        "port": gpu_server_port,
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(url=url, json=data)
        if response.status_code == 201:
            data = master_server_schema.StartupResponse(**response.json())

            setting_service.create_setting(
                db, setting_schema.SettingCreate(key="gpu-id", value=data.gpu._id)
            )
            auth_service.savePublickKey(data.publicKey)


async def start_up_connection(gpu_id: str):
    url = f"http://{master_server_host}:{master_server_port}{base_url}/startup"
    data = {
        "gpu-id": gpu_id,
        "host": gpu_server_host,
        "port": gpu_server_port,
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(url=url, json=data)
        if response.status_code == 200:
            response = master_server_schema.StartupResponse(**response.json())
            data = response.data
            auth_service.savePublickKey(data.publicKey)


async def heart_beat(db: Session):

    gpuIdSetting: Setting | None = setting_service.get_setting(db, "gpu-id")
    url = f"http://{master_server_host}:{master_server_port}{base_url}/heartbeat"
    data = {
        "gpu-id": gpuIdSetting.value,
    }
    while True:
        print("Heart Beat...")
        async with httpx.AsyncClient() as client:
            response = await client.put(url=url, json=data)
        await asyncio.sleep(15)


def shut_down_connection():
    pass
