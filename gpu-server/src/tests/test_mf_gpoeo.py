from dotenv import load_dotenv

load_dotenv()

import asyncio
import os
from services.jstp_client_service import gpu_monitoring_fetch

performance_measurement_app_path = os.environ.get(
    "PERFORMANCE_MEASUREMENT_APP_PATH"
)
performance_measurement_output_path = os.environ.get(
    "PERFORMANCE_MEASUREMENT_OUTPUT_PATH"
)

GPUIndex = "0"  # the number of the GPU to be measured
SampleInterval = "100"  # sample interval (ms)
PowerThreshold = "30"  # static power of GPU (W), excluding static power consumption

# set PerfMeasure as daemon
PMFlagBase = (
    f"-e -i {GPUIndex} -s {SampleInterval} -t {PowerThreshold} -m JSTP_DAEMON -trace"
)


async def run():

    await asyncio.sleep(1)

    print("Reset")
    await gpu_monitoring_fetch(url="RESET", method="POST", payload={"description": performance_measurement_output_path})
    
    print(f"Sleep 1s")
    await asyncio.sleep(1)
    
    print("Start")
    await gpu_monitoring_fetch(url="START", method="POST")
    print("Time stamp begin")
    await gpu_monitoring_fetch(url="TIME_STAMP", method="POST", payload={"description": "BEGIN"})
    
    
    
    print(f"Get hardware stats 10 times in 10s")
    
    for _ in range(0, 10):
        await gpu_monitoring_fetch(url="hardware-stats", method="GET")
        await asyncio.sleep(1)
    
    print("Time stamp end")
    await gpu_monitoring_fetch(url="TIME_STAMP", method="POST", payload={"description": "END"})
    
    print("Stop")
    await gpu_monitoring_fetch(url="STOP", method="POST")
    
    print(f"Sleep 2s")
    await asyncio.sleep(2)

    pass


if __name__ == "__main__":
    asyncio.run(run())
