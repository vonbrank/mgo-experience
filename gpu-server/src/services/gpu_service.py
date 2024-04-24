import os
import asyncio
from schemas.gpu_schema import GpuMeasurementDataBase
from schemas.json_protocol_schema import Request as JsonMessage
from pydantic import ValidationError
from services.jstp_client_service import gpu_monitoring_fetch

host = "127.0.0.1"
gpu_monitoring_port = int(os.environ.get("GPU_MONITORING_PORT"))
gpu_monitoring_frequency = int(os.environ.get("GPU_MONITORING_FREQUENCY"))
performance_measurement_output_path = os.environ.get(
    "PERFORMANCE_MEASUREMENT_OUTPUT_PATH"
)

data = None

gpu_measurement_date: GpuMeasurementDataBase | None = None

is_monitoring: bool = False


def get_gpu_measurement_date():
    return gpu_measurement_date


async def handle_update_gpu_state() -> None:
    response = await gpu_monitoring_fetch(url="hardware-stats", method="GET")
    print(f"gpu stats response = {response}")
    pass


async def start_monitor_gpu_state() -> None:

    await init_gpu_monitoring()

    global is_monitoring
    is_monitoring = True

    while is_monitoring:
        await asyncio.sleep(gpu_monitoring_frequency)
        await handle_update_gpu_state()


async def stop_monitor_gpu_state() -> None:
    global is_monitoring
    is_monitoring = False
    await asyncio.sleep(gpu_monitoring_frequency * 2)
    await exit_gpu_monitoring()


async def init_gpu_monitoring() -> None:

    print("init gpu monitoring...")

    await asyncio.sleep(1)

    print("Reset")
    await gpu_monitoring_fetch(
        url="RESET",
        method="POST",
        payload={"description": performance_measurement_output_path},
    )

    print(f"Sleep 1s")
    await asyncio.sleep(1)

    print("Start")
    await gpu_monitoring_fetch(url="START", method="POST")
    print("Time stamp begin")
    await gpu_monitoring_fetch(
        url="TIME_STAMP", method="POST", payload={"description": "BEGIN"}
    )


async def exit_gpu_monitoring() -> None:

    print("exit gpu monitoring...")

    print("Time stamp end")
    await gpu_monitoring_fetch(
        url="TIME_STAMP", method="POST", payload={"description": "END"}
    )

    print("Stop")
    await gpu_monitoring_fetch(url="STOP", method="POST")

    print(f"Sleep 2s")
    await asyncio.sleep(2)
