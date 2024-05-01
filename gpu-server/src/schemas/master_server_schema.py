from pydantic import BaseModel, Json
from schemas.gpu_schema import GpuInfo


class StartupData(BaseModel):
    gpu: GpuInfo
    publicKey: str


class StartupResponse(BaseModel):
    status: str
    data: StartupData
