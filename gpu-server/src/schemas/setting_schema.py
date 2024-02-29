from pydantic import BaseModel


class SettingBase(BaseModel):
    key: str
    value: str | None


class SettingCreate(SettingBase):
    pass
