import os
import asyncio
from schemas.gpu_schema import GpuMeasurementDataBase
from schemas.json_protocol_schema import Request as JsonMessage
from pydantic import ValidationError
from services.jstp_client_service import gpu_monitoring_fetch
import psutil
import platform
from cpuinfo import get_cpu_info
from utils.human_readable_size import human_readable_size
from utils import run_command_async

host = "127.0.0.1"
gpu_monitoring_port = int(os.environ.get("GPU_MONITORING_PORT"))
gpu_monitoring_frequency = int(os.environ.get("GPU_MONITORING_FREQUENCY"))
gpu_monitoring_mode = os.environ.get("GPU_MONITORING_MODE")

performance_measurement_app_path = os.environ.get("PERFORMANCE_MEASUREMENT_APP_PATH")
performance_measurement_output_path = os.environ.get(
    "PERFORMANCE_MEASUREMENT_OUTPUT_PATH"
)
performance_measurement_gpu_index = os.environ.get("PERFORMANCE_MEASUREMENT_GPU_INDEX")
performance_measurement_sample_interval = os.environ.get(
    "PERFORMANCE_MEASUREMENT_SAMPLE_INTERVAL"
)
performance_measurement_power_threshold = os.environ.get(
    "PERFORMANCE_MEASUREMENT_POWER_THRESHOLD"
)

data = None

gpu_measurement_data: GpuMeasurementDataBase | None = None

is_monitoring: bool = False


def get_gpu_measurement_data():
    return gpu_measurement_data


gpu_server_meta_data: dict = dict()


async def get_gpu_model():

    # await asyncio.create_subprocess_shell("ls")
    proc = await asyncio.create_subprocess_shell(
        "nvidia-smi -L", stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE
    )
    stdout, stderr = await proc.communicate()
    line = stdout.decode()
    _, line = line.split(":", 1)
    line, _ = line.split("(")
    return line.strip()


async def init_meta_data():
    global gpu_server_meta_data
    cpu_info = get_cpu_info()
    gpu_server_meta_data["os"] = platform.platform()
    gpu_server_meta_data["cpu"] = cpu_info["brand_raw"]
    gpu_server_meta_data["ram"] = human_readable_size(psutil.virtual_memory().total)
    gpu_server_meta_data["gpu"] = await get_gpu_model()


async def handle_update_gpu_state() -> None:

    if gpu_monitoring_mode == "NORMAL":
        await fetch_and_update_gpu_state()
    elif gpu_monitoring_mode == "FAKE_GPU_STATE":
        await update_fake_gpu_state()


async def gpu_state_apply_cpu_and_memory_date(
    gpu_measurement_data: GpuMeasurementDataBase,
) -> None:
    gpu_measurement_data_dict = gpu_measurement_data.model_dump()
    gpu_measurement_data_dict["usage_data"]["cpu_except_cores"] = int(
        psutil.cpu_percent()
    )
    gpu_measurement_data_dict["usage_data"]["cpu_cores"] = [
        int(x) for x in psutil.cpu_percent(percpu=True)
    ]
    gpu_measurement_data_dict["usage_data"]["cpu_memory"] = int(
        psutil.virtual_memory().percent
    )

    gpu_measurement_data = GpuMeasurementDataBase.model_validate(
        gpu_measurement_data_dict
    )

    return gpu_measurement_data


async def gpu_state_apply_meta_data(
    gpu_measurement_data: GpuMeasurementDataBase,
) -> None:
    gpu_measurement_data_dict = gpu_measurement_data.model_dump()

    gpu_measurement_data_dict["meta_data"] = dict(gpu_server_meta_data)

    gpu_measurement_data = GpuMeasurementDataBase.model_validate(
        gpu_measurement_data_dict
    )

    return gpu_measurement_data


async def fetch_and_update_gpu_state() -> None:
    response = await gpu_monitoring_fetch(url="hardware-stats", method="GET")
    print(f"gpu stats response = {response}")
    if response.header.status == 200:
        data = response.payload["data"]
        new_gpu_measurement_data = GpuMeasurementDataBase.random()
        new_gpu_measurement_data_dict = new_gpu_measurement_data.model_dump()
        new_gpu_measurement_data_dict["power_data"]["cpu_whole"] = int(
            data["power_data"]["cpu_whole"]
        )
        new_gpu_measurement_data_dict["power_data"]["gpu_whole"] = int(
            data["power_data"]["gpu_whole"]
        )
        new_gpu_measurement_data_dict["energy_data"]["cpu_whole"] = int(
            data["energy_data"]["cpu_whole"]
        )
        new_gpu_measurement_data_dict["energy_data"]["gpu_whole"] = int(
            data["energy_data"]["gpu_whole"]
        )
        new_gpu_measurement_data_dict["usage_data"]["cpu_memory"] = int(
            data["usage_data"]["cpu_memory"] * 100
        )
        new_gpu_measurement_data_dict["usage_data"]["gpu_core"] = int(
            data["usage_data"]["gpu_core"] * 100
        )
        global gpu_measurement_data
        gpu_measurement_data = GpuMeasurementDataBase.model_validate(
            new_gpu_measurement_data_dict
        )
        gpu_measurement_data = await gpu_state_apply_cpu_and_memory_date(
            gpu_measurement_data
        )
        gpu_measurement_data = await gpu_state_apply_meta_data(gpu_measurement_data)


async def update_fake_gpu_state() -> None:
    global gpu_measurement_data
    gpu_measurement_data = GpuMeasurementDataBase.random()
    gpu_measurement_data = await gpu_state_apply_cpu_and_memory_date(
        gpu_measurement_data
    )
    gpu_measurement_data = await gpu_state_apply_meta_data(gpu_measurement_data)


async def start_monitor_gpu_state() -> None:

    await init_gpu_monitoring()

    global is_monitoring
    is_monitoring = True

    while is_monitoring:
        await asyncio.sleep(gpu_monitoring_frequency)
        await handle_update_gpu_state()


async def stop_monitor_gpu_state() -> None:

    global is_monitoring

    if is_monitoring == False:
        return

    is_monitoring = False
    await asyncio.sleep(gpu_monitoring_frequency * 2)
    await exit_gpu_monitoring()


async def init_gpu_monitoring() -> None:

    print("init gpu monitoring...")

    await asyncio.sleep(1)

    if gpu_monitoring_mode == "NORMAL":
        await asyncio.sleep(1)

        try:
            await gpu_monitoring_fetch(
                url="EXIT",
                method="POST",
            )
        except Exception as e:
            print(e)

        performance_measurement_task = asyncio.create_task(
            run_performance_measurement()
        )

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

    if gpu_monitoring_mode == "NORMAL":

        print("Time stamp end")
        await gpu_monitoring_fetch(
            url="TIME_STAMP", method="POST", payload={"description": "END"}
        )

        print("Stop")
        await gpu_monitoring_fetch(url="STOP", method="POST")

        print(f"Sleep 2s")
        await asyncio.sleep(2)

        await gpu_monitoring_fetch(
            url="EXIT",
            method="POST",
        )


async def run_performance_measurement() -> None:
    PMFlagBase = f"-e -i {performance_measurement_gpu_index} -s {performance_measurement_sample_interval} -t {performance_measurement_power_threshold} -m JSTP_DAEMON -trace"
    cmd = f"sudo {performance_measurement_app_path} {PMFlagBase}"
    await asyncio.create_subprocess_shell(cmd)
