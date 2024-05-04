from pydantic import BaseModel
from schemas.gpu_schema import GpuMeasurementDataBase
import datetime
from faker import Faker

faker = Faker()


class UpdateBenchmarkModel(BaseModel):
    actionType: str
    actionOption: dict | None


class RunBenchmarkOption(BaseModel):
    testCaseName: str
    enableMfGpoeo: bool


class BenchmarkSampleData(BaseModel):
    timestamp: str
    power: int
    gpuUtil: int
    smClk: int
    memUtil: int
    memClk: int
    cpuPower: int

    @staticmethod
    def from_measurement_data(measurement_data: GpuMeasurementDataBase):
        return BenchmarkSampleData(
            timestamp=datetime.datetime.now(datetime.UTC).isoformat(),
            power=measurement_data.power_data.gpu_whole,
            gpuUtil=measurement_data.usage_data.gpu_core,
            smClk=measurement_data.frequency_data.gpu_core,
            memUtil=measurement_data.usage_data.gpu_memory,
            memClk=measurement_data.frequency_data.gpu_memory,
            cpuPower=measurement_data.power_data.cpu_whole,
        )


class BenchmarkSummaryData(BaseModel):
    enery: int
    minPower: int
    avgPower: int
    maxPower: int
    powerAboveThreshold: int
    eneryAboveThreshold: int
    minPoweAboveThresholdr: int
    avgPowerAboveThreshold: int
    maxPowerAboveThreshold: int
    minGPUUtil: int
    avgGPUUtil: int
    maxGPUUtil: int
    minSMClk: int
    avgSMClk: int
    maxSMClk: int
    minMemUtil: int
    avgMemUtil: int
    maxMemUtil: int
    minMemClk: int
    avgMemClk: int
    maxMemClk: int
    eneryCPU: int
    minPowerCPU: int
    avgPowerCPU: int
    maxPowerCPU: int

    @staticmethod
    def random():
        return BenchmarkSummaryData(
            enery=faker.random_int(1000, 10000),
            minPower=faker.random_int(10, 200),
            avgPower=faker.random_int(10, 200),
            maxPower=faker.random_int(10, 200),
            powerAboveThreshold=faker.random_int(1000, 10000),
            eneryAboveThreshold=faker.random_int(10, 200),
            minPoweAboveThresholdr=faker.random_int(10, 200),
            avgPowerAboveThreshold=faker.random_int(10, 200),
            maxPowerAboveThreshold=faker.random_int(10, 200),
            minGPUUtil=faker.random_int(1, 100),
            avgGPUUtil=faker.random_int(1, 100),
            maxGPUUtil=faker.random_int(1, 100),
            minSMClk=faker.random_int(300, 2000),
            avgSMClk=faker.random_int(300, 2000),
            maxSMClk=faker.random_int(300, 2000),
            minMemUtil=faker.random_int(1, 100),
            avgMemUtil=faker.random_int(1, 100),
            maxMemUtil=faker.random_int(1, 100),
            minMemClk=faker.random_int(400, 7000),
            avgMemClk=faker.random_int(400, 7000),
            maxMemClk=faker.random_int(400, 7000),
            eneryCPU=faker.random_int(1000, 1000),
            minPowerCPU=faker.random_int(10, 100),
            avgPowerCPU=faker.random_int(10, 100),
            maxPowerCPU=faker.random_int(10, 100),
        )
