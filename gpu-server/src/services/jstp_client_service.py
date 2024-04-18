from schemas.json_protocol_schema import RequestHeader, Request, Response

import asyncio
from dotenv import load_dotenv
import os

load_dotenv()

host = "127.0.0.1"
gpu_monitoring_port = int(os.environ.get("GPU_MONITORING_PORT"))


async def fetch(
    url: str, payload: dict | None, method: str = "GET", version: str = "0.1"
) -> Request:
    reader, writer = await asyncio.open_connection(host, gpu_monitoring_port)

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
    print(f"jstp response = {Response.model_validate_json(jstp_response_json_string)}")

    writer.close()

    return None
