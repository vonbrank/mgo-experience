import os
import asyncio
from schemas.gpu_schema import GpuMeasurementDataBase
from schemas.json_protocol_schema import Message as JsonMessage
from pydantic import ValidationError

host = "127.0.0.1"
gpu_monitoring_port = int(os.environ.get("GPU_MONITORING_PORT"))

data = None

gpu_measurement_date: GpuMeasurementDataBase | None = None


def get_gpu_measurement_date():
    return gpu_measurement_date


async def handle_update_gpu_state(
    reader: asyncio.StreamReader, writer: asyncio.StreamWriter
) -> None:
    data = None
    while data != b"quit":
        data = await reader.read(1024)
        msg = data.decode()
        addr, port = writer.get_extra_info("peername")

        json_message: JsonMessage | None = None
        try:
            json_message = JsonMessage.model_validate_json(msg)
        except ValidationError as e:
            print(e)

        if json_message is not None:
            if json_message.header.message_type == "GPU_STATE":
                try:
                    global gpu_measurement_date
                    new_gpu_measurement_date = GpuMeasurementDataBase.model_validate(
                        json_message.data
                    )
                    gpu_measurement_date = new_gpu_measurement_date
                except ValidationError as e:
                    print(e)

        writer.write(data)
        await writer.drain()

    writer.close()

    print(f"[GPU monitoring server]: closing updating gpu state...")

    await writer.wait_closed()


async def monitor_gpu_state() -> None:
    server = await asyncio.start_server(
        handle_update_gpu_state, host, gpu_monitoring_port
    )
    print(
        f"[GPU monitoring server]: GPU monitoring server is running at http://localhost:{gpu_monitoring_port}"
    )
    async with server:
        await server.serve_forever()
