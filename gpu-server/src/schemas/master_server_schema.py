from pydantic import BaseModel, Json
from schemas.gpu_schema import GpuInfo

class StartupResponse(BaseModel):
    gpu: GpuInfo
    publicKey: str
    