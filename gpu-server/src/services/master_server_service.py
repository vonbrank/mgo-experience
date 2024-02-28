import requests
import json
import os
from app import db
from models import Setting

master_server_host = os.environ.get("MASTER_SERVER_HOST")
master_server_port = int(os.environ.get("MASTER_SERVER_PORT"))
gpu_id = os.environ.get("GPU_ID")


def start_up_connection():
    url = f"http://{master_server_host}:{master_server_port}/api/v1/gpus/startup"
    headers = {'Content-Type': 'application/json'}
    data = {
        "gpu-id": gpu_id,
        "host": master_server_host,
        "port": master_server_port
    }

    response = requests.post(url=url, headers=headers, data=json.dumps(data))
    result = response.json()
    res_gpu_id = result["data"]["_id"]
    
    
    setting = Setting.query.filter_by(key="gpu-id").first()

    if setting is None:
        setting = Setting(key="gpu-id", value=res_gpu_id)
        db.session.add(setting)

    db.session.commit()
    
    
    pass


def heart_beat():
    pass


def shut_down_connection():
    pass
