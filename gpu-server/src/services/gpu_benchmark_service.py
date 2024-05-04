import os
import asyncio
from datetime import datetime
from services.gpu_service import get_gpu_measurement_data
from schemas.benchmark_schema import BenchmarkSampleData, BenchmarkSummaryData

benchmark_state = "IDLE"

benchmark_matrix_mul_path = os.environ.get("BENCHMARK_MATRIX_MUL_PATH")
benchmark_vector_plus_path = os.environ.get("BENCHMARK_VECTOR_PLUS_PATH")
benchmark_graphics_rendering_path = os.environ.get("BENCHMARK_GRAPHICS_RENDERING_PATH")
benchmark_running_mode = os.environ.get("BENCHMARK_RUNNING_MODE")


mfgpoeo_so_path = os.environ.get("MFGPOEO_SO_PATH")
mfgpoeo_config_path = os.environ.get("MFGPOEO_CONFIG_PATH")
mfgpoeo_output_path = os.environ.get("MFGPOEO_OUTPUT_PATH")
mfgpoeo_work_mode = os.environ.get("MFGPOEO_WORK_MODE")

test_program_paths = {
    "matrixMul": benchmark_matrix_mul_path,
    "vectorAddition": benchmark_vector_plus_path,
    "graphicsRendering": benchmark_graphics_rendering_path,
}


def get_benchmark_report_default_value():
    return {
        "startTime": datetime.now().isoformat(),
        "completedTime": datetime.now().isoformat(),
        "stdout": "",
        "stderr": "",
        "data": list(),
        "summary": None,
        "testCase": None,
    }


benchmark_report = get_benchmark_report_default_value()

test_cases: list = [
    {
        "name": "vectorAddition",
        "label": "Vector Addition",
        "description": "Vector Addition",
        "imageUrl": "https://cdn1.byjus.com/wp-content/uploads/2021/08/Polygon-law-of-vector-addition.png",
    },
    {
        "name": "matrixMul",
        "label": "Matrix Multiplication",
        "description": "Matrix Multiplication",
        "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4YndIik4GnbkUAFL0ckor93ZoW0AlsVAd-AC1JwgVWg&s",
    },
    {
        "name": "graphicsRendering",
        "label": "Graphics Rendering",
        "description": "Graphics Rendering",
        "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/2/24/Cornell_box.png",
    },
    {
        "name": "aiTraning",
        "label": "AI Training",
        "description": "AI Training",
        "imageUrl": "https://www.nvidia.com/content/dam/en-zz/Solutions/deep-learning/deep-learning-solutions/machine-learning/nvidia-enterprise-inference-2c50-p@2x.jpg",
    },
]

current_running_test_case = None


async def get_benchmark_state():

    global benchmark_report
    global benchmark_state

    if benchmark_state == "IDLE":
        return {"state": "IDLE", "testCases": test_cases}

    if benchmark_state == "RUNNING":
        return {
            "state": "RUNNING",
            "info": {
                "startTime": benchmark_report["startTime"],
                "testCase": current_running_test_case,
            },
        }

    if benchmark_state == "COMPLETED":
        return {"state": "COMPLETED", "report": benchmark_report}


async def reset_benchmark() -> str:

    global benchmark_report
    global benchmark_state

    if benchmark_state == "COMPLETED":
        benchmark_state = "IDLE"
        benchmark_report = get_benchmark_report_default_value()

    return benchmark_state


async def start_run_bechmark(test_program_name: str, enable_mf_gpeoe: bool) -> str:

    global benchmark_report
    global benchmark_state

    if benchmark_state == "IDLE":

        benchmark_report = get_benchmark_report_default_value()
        benchmark_state = "RUNNING"
        asyncio.create_task(run_bechmark(test_program_name, enable_mf_gpeoe))

    return benchmark_state


async def start_monitoring_during_running():
    global benchmark_state
    global benchmark_report

    measurement_data = get_gpu_measurement_data()
    benchmark_report_data: list[BenchmarkSampleData] = benchmark_report["data"]
    benchmark_report_data.append(
        BenchmarkSampleData.from_measurement_data(measurement_data)
    )
    benchmark_report["data"] = benchmark_report_data

    while benchmark_state == "RUNNING":
        await asyncio.sleep(1)
        measurement_data = get_gpu_measurement_data()
        benchmark_report_data: list[BenchmarkSampleData] = benchmark_report["data"]
        benchmark_report_data.append(
            BenchmarkSampleData.from_measurement_data(measurement_data)
        )
        benchmark_report["data"] = benchmark_report_data


async def run_bechmark(test_program_name: str, enable_mf_gpeoe: bool) -> None:

    global benchmark_report
    global benchmark_state
    global current_running_test_case

    asyncio.create_task(start_monitoring_during_running())

    if mfgpoeo_work_mode == "FAKE_RUNNING":

        program_path = test_program_paths.get(test_program_name)

        if program_path != None:
            cmd = f"""
                sudo f{program_path};
            """

            if enable_mf_gpeoe:
                cmd = f"""
                    echo "export CUDA_INJECTION64_PATH={mfgpoeo_so_path}";
                    export CUDA_INJECTION64_PATH={mfgpoeo_so_path};
                    echo "export MFGPOEO_CONFIG_PATH={mfgpoeo_config_path}";
                    export MFGPOEO_CONFIG_PATH;
                    echo "export MFGPOEO_OUTPUT_PATH={mfgpoeo_output_path}";
                    export MFGPOEO_OUTPUT_PATH;
                    echo "export MFGPOEO_WORK_MODE={mfgpoeo_work_mode}";
                    export MFGPOEO_WORK_MODE;
                    {cmd}
                    echo "unset CUDA_INJECTION64_PATH";
                    unset CUDA_INJECTION64_PATH;
                    echo "unset MFGPOEO_CONFIG_PATH";
                    unset MFGPOEO_CONFIG_PATH;
                    echo "unset MFGPOEO_OUTPUT_PATH";
                    unset MFGPOEO_OUTPUT_PATH;
                    echo "unset MFGPOEO_WORK_MODE";
                    unset MFGPOEO_WORK_MODE;
                """

            proc = await asyncio.create_subprocess_shell(cmd)
            stdout, stderr = await proc.communicate()
        else:
            pass

    else:
        current_running_test_case = test_cases[0]
        benchmark_report["testCase"] = current_running_test_case
        await asyncio.sleep(5)
        current_running_test_case = None
        benchmark_report["stdout"] = "Test stdout."
        benchmark_report["stderr"] = "Test stderr."

    benchmark_report["summary"] = BenchmarkSummaryData.random()
    benchmark_report["completedTime"] = datetime.now().isoformat()

    benchmark_state = "COMPLETED"
