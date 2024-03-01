from pydantic import BaseModel


class Header(BaseModel):
    message_type: str


class Message(BaseModel):
    header: Header
    data: dict
