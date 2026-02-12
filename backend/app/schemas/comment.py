from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class CommentBase(BaseModel):
    content: str
    parent_id: Optional[int] = None

class CommentCreate(CommentBase):
    pass

class Comment(CommentBase):
    id: int
    task_id: int
    user_id: int
    created_at: datetime
    # We could nest replies here or handle flatten list in frontend. 
    # For simplicity, returning flat list often easier, but let's do simple recursive hint.
    
    class Config:
        from_attributes = True

class Attachment(BaseModel):
    id: int
    filename: str
    size: int
    created_at: datetime
    
    class Config:
        from_attributes = True
