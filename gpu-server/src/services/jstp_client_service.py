from schemas.json_protocol_schema import RequestHeader, Request, Response

import asyncio
from dotenv import load_dotenv
import os

gpu_monitoring_host = "127.0.0.1"
gpu_monitoring_port = int(os.environ.get("GPU_MONITORING_PORT"))


async def gpu_monitoring_fetch(
    url: str, payload: dict | None = None, method: str = "GET", version: str = "0.1"
) -> Response:
    return await fetch(
        gpu_monitoring_host, gpu_monitoring_port, url, payload, method, version
    )


async def fetch(
    host: str,
    port: int,
    url: str,
    payload: dict | None = None,
    method: str = "GET",
    version: str = "0.1",
) -> Response:
    reader, writer = await asyncio.open_connection(host, port)

    jstp_message = Request(
        header=RequestHeader(method=method, url=url, version=version),
        payload=payload,
    )
    json_string = jstp_message.model_dump_json()
    tcp_message = f"{len(json_string)}\r\n{json_string}".encode()
    # print(f"tcp message = {tcp_message}")
    writer.write(tcp_message)
    await writer.drain()

    jstp_response_first_line: str = ""
    jstp_response_first_line_ch: str = ""
    while True:
        jstp_response_first_line_ch = await reader.read(1)
        jstp_response_first_line += jstp_response_first_line_ch.decode()
        if jstp_response_first_line.endswith("\r\n"):
            break
    jstp_response_first_line.rstrip("\r\n")
    jstp_response_length = int(jstp_response_first_line)
    # print(f"jstp response length = {jstp_response_length}")
    jstp_response_json_string = await reader.readexactly(jstp_response_length)
    jstp_response_json_string.decode()
    # print(f"jstp response json = {jstp_response_json_string}")
    response = Response.model_validate_json(jstp_response_json_string)
    # print(f"jstp response = {response}")

    writer.close()

    return response
