from dotenv import load_dotenv

load_dotenv()

import sys
import os

src_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "src"))
sys.path.append(src_path)

import asyncio
import time
import os
import json
from schemas.gpu_schema import GpuMeasurementDataBase
from schemas.json_protocol_schema import (
    Request as JsonMessage,
    RequestHeader as JsonMessageHeader,
)


host = "127.0.0.1"
gpu_monitoring_port = int(os.environ.get("GPU_MONITORING_PORT"))

send_interval_in_seconds = 1


async def run_client() -> None:

    reader, writer = await asyncio.open_connection(host, gpu_monitoring_port)

    writer.write(b"Hello world!")
    await writer.drain()

    count = 10

    while True:
        data = await reader.read(1024)
        if not data:
            raise Exception("socket closed")

        # print(f"Received: {data.decode()!r}")

        if count > 0:
            await asyncio.sleep(send_interval_in_seconds)
            data = GpuMeasurementDataBase.random()
            json_message = JsonMessage(
                header=JsonMessageHeader(message_type="GPU_STATE"),
                data=data.model_dump(),
            )
            writer.write(json_message.model_dump_json().encode())
            await writer.drain()
            count -= 1
        else:
            writer.write(b"quit")
            await writer.drain()
            break


if __name__ == "__main__":
    asyncio.run(run_client())
