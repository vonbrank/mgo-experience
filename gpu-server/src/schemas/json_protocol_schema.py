from pydantic import BaseModel


class RequestHeader(BaseModel):
    method: str
    url: str
    version: str


class ResponseHeader(BaseModel):
    status: int


class Request(BaseModel):
    header: RequestHeader
    payload: dict | None


class Response(BaseModel):
    header: ResponseHeader
    payload: dict | None
