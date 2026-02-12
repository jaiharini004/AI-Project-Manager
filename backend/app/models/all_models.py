from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, Text
from sqlalchemy.orm import relationship
from app.db.base import Base

class Organization(Base):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    subscription_tier = Column(String, default="free")
    
    users = relationship("User", back_populates="organization")
    projects = relationship("Project", back_populates="organization")
    tasks = relationship("Task", back_populates="organization")

class User(Base):
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    role = Column(String, default="member") # admin, member
    
    organization_id = Column(Integer, ForeignKey("organization.id"), nullable=False)
    organization = relationship("Organization", back_populates="users")

class Project(Base):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=True)
    
    organization_id = Column(Integer, ForeignKey("organization.id"), nullable=False)
    organization = relationship("Organization", back_populates="projects")
    
    tasks = relationship("Task", back_populates="project")

class Task(Base):
    id = Column(Integer, primary_key=True, index=True)
    display_id = Column(Integer, index=True, nullable=False, default=1) # Sequential ID per Org
    title = Column(String, index=True, nullable=False)
    status = Column(String, default="todo") # todo, in-progress, done
    priority = Column(String, default="medium")
    
    project_id = Column(Integer, ForeignKey("project.id"), nullable=False)
    project = relationship("Project", back_populates="tasks")
    
    organization_id = Column(Integer, ForeignKey("organization.id"), nullable=False)
    organization = relationship("Organization", back_populates="tasks")
    
    comments = relationship("Comment", back_populates="task")
    attachments = relationship("Attachment", back_populates="task")

class Comment(Base):
    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    user = relationship("User") # backref not strictly needed for this demo
    
    task_id = Column(Integer, ForeignKey("task.id"), nullable=False)
    task = relationship("Task", back_populates="comments")
    
    parent_id = Column(Integer, ForeignKey("comment.id"), nullable=True)
    parent = relationship("Comment", remote_side=[id], backref="replies")

class Attachment(Base):
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    size = Column(Integer, default=0)
    
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    user = relationship("User")
    
    task_id = Column(Integer, ForeignKey("task.id"), nullable=False)
    task = relationship("Task", back_populates="attachments")
