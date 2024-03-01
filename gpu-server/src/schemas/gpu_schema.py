from typing import List
from pydantic import BaseModel
from faker import Faker

faker = Faker()


class HardwareDataBase(BaseModel):
    cpu_cores: List[int]
    cpu_except_cores: int
    cpu_memory: int


class HardwareDataWithWhole(HardwareDataBase):
    cpu_whole: int
    gpu_whole: int


class HardwareDataWithGpuData(HardwareDataBase):
    gpu_core: int
    gpu_memory: int


class PowerData(HardwareDataWithWhole):
    @staticmethod
    def random():
        cpu_cores = [faker.random_int(5, 30) for _ in range(8)]
        cpu_except_cores = faker.random_int(5, 30)
        cpu_memory = faker.random_int(5, 30)
        cpu_whole = sum(cpu_cores) + cpu_except_cores
        gpu_whole = faker.random_int(10, 300)
        return PowerData(
            cpu_cores=cpu_cores,
            cpu_except_cores=cpu_except_cores,
            cpu_memory=cpu_memory,
            cpu_whole=cpu_whole,
            gpu_whole=gpu_whole,
        )


class EnergyData(HardwareDataWithWhole):
    @staticmethod
    def random():
        power_data = PowerData.random()
        time_in_seconds = 3600
        return EnergyData(
            cpu_cores=list(map(lambda x: x * time_in_seconds, power_data.cpu_cores)),
            cpu_except_cores=power_data.cpu_except_cores * time_in_seconds,
            cpu_memory=power_data.cpu_memory * time_in_seconds,
            cpu_whole=power_data.cpu_whole * time_in_seconds,
            gpu_whole=power_data.gpu_whole * time_in_seconds,
        )


class FrequencyData(HardwareDataWithGpuData):
    @staticmethod
    def random():
        cpu_cores = [faker.random_int(200, 5000) for _ in range(8)]
        cpu_except_cores = faker.random_int(100, 1000)
        cpu_memory = faker.random_int(5, 30)
        gpu_core = faker.random_int(750, 2500)
        gpu_memory = faker.random_int(1500, 7500)
        return FrequencyData(
            cpu_cores=cpu_cores,
            cpu_except_cores=cpu_except_cores,
            cpu_memory=cpu_memory,
            gpu_core=gpu_core,
            gpu_memory=gpu_memory,
        )


class TemperatureData(HardwareDataWithWhole):
    @staticmethod
    def random():
        cpu_cores = [faker.random_int(40, 110) for _ in range(8)]
        cpu_except_cores = faker.random_int(30, 90)
        cpu_memory = faker.random_int(30, 80)
        cpu_whole = faker.random_int(40, 110)
        gpu_whole = faker.random_int(40, 100)
        return TemperatureData(
            cpu_cores=cpu_cores,
            cpu_except_cores=cpu_except_cores,
            cpu_memory=cpu_memory,
            cpu_whole=cpu_whole,
            gpu_whole=gpu_whole,
        )


class UsageData(HardwareDataWithGpuData):
    @staticmethod
    def random():
        cpu_cores = [faker.random_int(1, 100) for _ in range(8)]
        cpu_except_cores = faker.random_int(1, 100)
        cpu_memory = faker.random_int(1, 100)
        gpu_core = faker.random_int(1, 100)
        gpu_memory = faker.random_int(1, 100)
        return UsageData(
            cpu_cores=cpu_cores,
            cpu_except_cores=cpu_except_cores,
            cpu_memory=cpu_memory,
            gpu_core=gpu_core,
            gpu_memory=gpu_memory,
        )


class EnergyOptimizationIndexData(BaseModel):
    relative_performance_lossed: int
    relative_power_saved: int
    edp: int
    ed2: int
    reinforcement_learning_reward: int


class GpuMeasurementDataBase(BaseModel):
    power_data: PowerData
    power_upper_limit: PowerData
    energy_data: EnergyData
    static_power: int
    frequency_data: FrequencyData
    frequency_upper_limit: FrequencyData
    frequency_lower_limit: FrequencyData

    @staticmethod
    def random():
        return GpuMeasurementDataBase(
            power_data=PowerData.random(),
            power_upper_limit=PowerData.random(),
            energy_data=EnergyData.random(),
            static_power=faker.random_int(10, 100),
            frequency_data=FrequencyData.random(),
            frequency_upper_limit=FrequencyData.random(),
            frequency_lower_limit=FrequencyData.random(),
        )
