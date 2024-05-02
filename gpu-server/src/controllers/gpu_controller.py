from routes.gpu_route import router
from services.gpu_service import get_gpu_measurement_data, stop_monitor_gpu_state
import asyncio
import os
import signal

@router.get("/state", tags=["GPU"])
async def get_gpu_state():
    data = get_gpu_measurement_data()
    return {"status": "success", "data": data}

@router.post("/shutdown", tags=["GPU"])
async def shutdown_gpu_server():
    await stop_monitor_gpu_state()
    await asyncio.sleep(5)
    os.kill(os.getpid(), signal.SIGINT)
