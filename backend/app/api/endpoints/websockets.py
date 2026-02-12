from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.core.websocket import manager

router = APIRouter()

@router.websocket("/ws/{org_id}")
async def websocket_endpoint(websocket: WebSocket, org_id: str):
    await manager.connect(websocket, org_id)
    try:
        while True:
            # We just keep the connection open. 
            # In a full chat app, we'd receive text/json here.
            # For this board sync, we act mostly as a receiver of broadcasts 
            # triggered by HTTP endpoints, but we can also echo.
            data = await websocket.receive_text()
            # Optional: Echo or handle client-sent socket messages
            # await manager.broadcast({"type": "ping", "data": data}, org_id)
    except WebSocketDisconnect:
        manager.disconnect(websocket, org_id)
