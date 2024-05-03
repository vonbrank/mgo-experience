from pydantic import BaseModel


class UpdateBenchmarkModel(BaseModel):
    actionType: str
    actionOption: dict | None


class RunBenchmarkOption(BaseModel):
    testCaseName: str
    enableMfGpoeo: bool
