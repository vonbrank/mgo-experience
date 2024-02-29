from sqlalchemy.orm import Session
from models import Setting
from schemas import setting_schema


def get_settings(db: Session):
    return db.query(Setting).all()


def get_setting(db: Session, key: str):
    return db.query(Setting).filter_by(key=key).first()


def create_setting(db: Session, setting: setting_schema.SettingCreate):
    db_setting = Setting(key=setting.key, value=setting.value)
    db.add(db_setting)
    db.commit()
    db.refresh(db_setting)
    return db_setting
