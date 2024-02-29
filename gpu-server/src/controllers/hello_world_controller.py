from routes.hello_world_route import router
from fastapi import Response


@router.get("/", tags=["ROOT"])
async def hello_world():
    return Response(content="Python Flask Restful Server")
