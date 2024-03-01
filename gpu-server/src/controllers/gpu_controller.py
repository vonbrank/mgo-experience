from routes.gpu_route import router
from services.gpu_service import get_gpu_measurement_date


@router.get("/state", tags=["GPU"])
async def get_gpu_state():
    data = get_gpu_measurement_date()
    return {"status": "success", "data": data}
