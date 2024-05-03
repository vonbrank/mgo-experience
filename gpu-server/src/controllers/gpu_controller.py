from routes.gpu_route import router
from services.gpu_service import get_gpu_measurement_data, stop_monitor_gpu_state
from services.gpu_benchmark_service import (
    get_benchmark_state as get_benchmark_service_state,
    start_run_bechmark,
    reset_benchmark,
)
import asyncio
import os
import signal
from schemas.benchmark_schema import UpdateBenchmarkModel, RunBenchmarkOption
from fastapi import HTTPException


@router.get("/state", tags=["GPU"])
async def get_gpu_state():
    data = get_gpu_measurement_data()
    return {"status": "success", "data": data}


@router.post("/shutdown", tags=["GPU"])
async def shutdown_gpu_server():
    await stop_monitor_gpu_state()
    await asyncio.sleep(5)
    os.kill(os.getpid(), signal.SIGINT)
    return {
        "status": "success",
        "data": None,
    }


@router.get("/benchmark", tags=["GPU"])
async def get_benchmark_state():
    data = await get_benchmark_service_state()
    return {"status": "success", "data": data}


@router.post("/benchmark", tags=["GPU"])
async def update_benchmark_state(model: UpdateBenchmarkModel):

    if model.actionType == "Run":
        option = RunBenchmarkOption.model_validate(model.actionOption)
        benchmark_state = await start_run_bechmark(
            option.testCaseName, option.enableMfGpoeo
        )
        return {"status": "success", "data": {"benchmarkState": benchmark_state}}
    elif model.actionType == "Reset":
        benchmark_state = await reset_benchmark()
        return {"status": "success", "data": {"benchmarkState": benchmark_state}}
    else:
        raise HTTPException(
            status_code=400, detail=f"Action type {model.actionType} is invalid."
        )
