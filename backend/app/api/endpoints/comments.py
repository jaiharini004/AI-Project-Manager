from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
import shutil
import os
from datetime import datetime

from app.db.session import get_db
from app.api import deps
from app.models.all_models import User, Comment, Attachment, Task
from app.schemas.comment import CommentCreate, Comment as CommentSchema, Attachment as AttachmentSchema
from app.core.websocket import manager

router = APIRouter()

UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

@router.get("/{task_id}/comments", response_model=List[CommentSchema])
async def read_comments(
    task_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user),
):
    result = await db.execute(select(Comment).where(Comment.task_id == task_id))
    return result.scalars().all()

@router.post("/{task_id}/comments", response_model=CommentSchema)
async def create_comment(
    task_id: int,
    comment_in: CommentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user),
):
    comment = Comment(
        **comment_in.model_dump(),
        task_id=task_id,
        user_id=current_user.id
    )
    db.add(comment)
    await db.commit()
    await db.refresh(comment)
    
    # Broadcast
    await manager.broadcast({
        "type": "COMMENT_ADDED",
        "task_id": task_id,
        "payload": CommentSchema.model_validate(comment).model_dump(mode='json')
    }, str(current_user.organization_id))
    
    return comment

@router.post("/{task_id}/attachments", response_model=AttachmentSchema)
async def upload_attachment(
    task_id: int,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user),
):
    file_path = os.path.join(UPLOAD_DIR, f"{task_id}_{int(datetime.now().timestamp())}_{file.filename}")
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    attachment = Attachment(
        filename=file.filename,
        file_path=file_path,
        size=os.path.getsize(file_path),
        task_id=task_id,
        user_id=current_user.id
    )
    db.add(attachment)
    await db.commit()
    await db.refresh(attachment)
    
    return attachment
