from pydantic import BaseModel
from typing import Optional, List

class TaskBase(BaseModel):
    title: str
    priority: str = "Medium"
    status: str = "todo"
    estimated_hours: Optional[int] = 0

class TaskCreate(TaskBase):
    pass

class Task(TaskBase):
    id: int
    organization_id: int
    project_id: int # optional/default

    class Config:
        from_attributes = True

class GoalRequest(BaseModel):
    goal: str
    project_id: int = 1 
