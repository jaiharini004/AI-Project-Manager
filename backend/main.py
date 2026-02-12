from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.middleware import TenantMiddleware
from app.db.session import engine
from app.db.base import Base
from app.models import all_models # Import to register models with Base

import contextlib

@contextlib.asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    # Shutdown logic if needed

from app.api.endpoints import auth, tasks, websockets, comments

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

app.include_router(auth.router, prefix=f"{settings.API_V1_STR}", tags=["auth"])
app.include_router(tasks.router, prefix=f"{settings.API_V1_STR}/tasks", tags=["tasks"])
app.include_router(websockets.router, prefix=f"{settings.API_V1_STR}", tags=["websockets"])
app.include_router(comments.router, prefix=f"{settings.API_V1_STR}/tasks", tags=["comments"])

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(TenantMiddleware)

@app.get("/health")
async def health_check():
    return {"status": "ok", "app": settings.PROJECT_NAME}

@app.get("/")
async def root():
    return {"message": "AI Project Manager API is running"}
