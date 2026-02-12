from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.db.session import get_db
from app.api import deps
from app.models.all_models import User, Task
from app.schemas.task import TaskCreate, Task as TaskSchema, GoalRequest
from app.core.ai_service import generate_tasks_from_goal
from app.core.websocket import manager

router = APIRouter()

@router.get("/", response_model=List[TaskSchema])
async def read_tasks(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user),
    skip: int = 0,
    limit: int = 100,
):
    # Tenant filtering via middleware or explicit check
    result = await db.execute(
        select(Task).where(Task.organization_id == current_user.organization_id).offset(skip).limit(limit)
    )
    return result.scalars().all()

@router.post("/", response_model=TaskSchema)
async def create_task(
    task_in: TaskCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.allow_create),
):
    # Calculate next display_id for this organization
    stmt = select(Task.display_id).where(Task.organization_id == current_user.organization_id).order_by(Task.display_id.desc()).limit(1)
    result = await db.execute(stmt)
    max_id = result.scalar_one_or_none()
    next_id = (max_id or 0) + 1

    task = Task(
        **task_in.model_dump(),
        display_id=next_id,
        organization_id=current_user.organization_id,
        project_id=1 
    )
    db.add(task)
    await db.commit()
    await db.refresh(task)
    return task

@router.post("/generate", response_model=List[TaskSchema])
async def generate_tasks(
    goal_req: GoalRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.allow_create), # Viewer, Editor, Admin
):
    # 1. Call AI (Synchronous call wrapped, or assume fast enough for <=5 tasks)
    # Ideally run in separate thread or use AsyncGroq
    import asyncio
    from functools import partial
    
    # Run synchronous Groq call in threadpool to avoid blocking event loop
    loop = asyncio.get_event_loop()
    generated_data = await loop.run_in_executor(None, generate_tasks_from_goal, goal_req.goal)
    
    # Calculate next display_id start
    stmt = select(Task.display_id).where(Task.organization_id == current_user.organization_id).order_by(Task.display_id.desc()).limit(1)
    result = await db.execute(stmt)
    max_id = result.scalar_one_or_none()
    current_display_id = (max_id or 0)

    new_tasks = []
    for t_data in generated_data:
        current_display_id += 1
        task = Task(
            title=t_data.get("title", "Untitled Task"),
            display_id=current_display_id,
            priority=t_data.get("priority", "Medium"),
            estimated_hours=t_data.get("estimated_hours", 0),
            status="todo",
            organization_id=current_user.organization_id,
            project_id=goal_req.project_id
        )
        db.add(task)
        new_tasks.append(task)
    
    await db.commit()
    for t in new_tasks:
        await db.refresh(t)
        
    # Broadcast update
    await manager.broadcast({
        "type": "TASKS_GENERATED",
        "payload": [TaskSchema.model_validate(t).model_dump() for t in new_tasks]
    }, str(current_user.organization_id))

    return new_tasks

@router.delete("/{task_id}")
@router.delete("/{task_id}")
async def delete_task(
    task_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.allow_delete), # Only Owner
):
    # Logic to delete task
    # For demo, we just broadcast the deletion event
    await manager.broadcast({
        "type": "TASK_DELETED",
        "payload": { "id": task_id }
    }, str(current_user.organization_id))
    
    return {"status": "success", "id": task_id}
