import os
import asyncio

benchmark_state = "IDLE"

benchmark_matrix_mul_path = os.environ.get("BENCHMARK_MATRIX_MUL_PATH")
benchmark_vector_plus_path = os.environ.get("BENCHMARK_VECTOR_PLUS_PATH")
benchmark_graphics_rendering_path = os.environ.get("BENCHMARK_GRAPHICS_RENDERING_PATH")

mfgpoeo_so_path = os.environ.get("MFGPOEO_SO_PATH")
mfgpoeo_config_path = os.environ.get("MFGPOEO_CONFIG_PATH")
mfgpoeo_output_path = os.environ.get("MFGPOEO_OUTPUT_PATH")
mfgpoeo_work_mode = os.environ.get("MFGPOEO_WORK_MODE")

test_program_paths = {
    "matrix_mul": benchmark_matrix_mul_path,
    "vector_plus": benchmark_vector_plus_path,
    "graphics_rendering": benchmark_graphics_rendering_path,
}

benchmark_report = None


async def get_benchmark_state():

    if benchmark_state == "IDLE":
        return {"state": "IDLE", "test_programs": list(test_program_paths.keys())}

    if benchmark_state == "RUNNING":
        return {"state": "RUNNING"}

    if benchmark_state == "COMPLETED":
        return {"state": "COMPLETED", "report": benchmark_report}


async def reset_benchmark():

    if benchmark_state == "COMPLETED":
        benchmark_state = "IDLE"


async def run_bechmark(test_program_name: str, enable_mf_gpeoe: bool) -> None:

    if benchmark_state != "IDLE":
        return

    program_path = test_program_paths.get(test_program_name)

    if program_path == None:
        return

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

    benchmark_state = "RUNNING"

    await asyncio.create_subprocess_shell(cmd)

    benchmark_state = "COMPLETED"
