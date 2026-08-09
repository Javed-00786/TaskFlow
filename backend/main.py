from fastapi import FastAPI, Depends, HTTPException, status, Request, Query
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Text, ForeignKey, func, case
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship, Session
from pydantic import BaseModel, Field, field_validator
from typing import List, Optional, Dict, Any
import time
import os

# import Fast api
app = FastAPI()

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./taskflow.db")
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# SQLAlchemy Models
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=False)
    projects = relationship("Project", back_populates="owner")

class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    owner = relationship("User", back_populates="projects")
    tasks = relationship("Task", back_populates="project")

class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    priority = Column(String, nullable=False)  # "low", "medium", "high"
    due_date = Column(String, nullable=True)  # stored as text
    status = Column(String, default="pending")  # pending, in_progress, completed
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    project = relationship("Project", back_populates="tasks")

# Create tables
Base.metadata.create_all(bind=engine)

# Pydantic Models
class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    priority: str = Field(..., pattern="^(low|medium|high)$")
    due_date: Optional[str] = None
    status: str = "pending"
    project_id: int

    @field_validator("title")
    @classmethod
    def validate_title(cls, v):
        if not v or not v.strip():
            raise ValueError("Title cannot be empty or whitespace only")
        return v.strip()

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[str] = Field(None, pattern="^(low|medium|high)$")
    due_date: Optional[str] = None
    status: Optional[str] = None
    project_id: Optional[int] = None

class TaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    priority: str
    due_date: Optional[str]
    status: str
    project_id: int

    class Config:
        from_attributes = True

class ProjectCreate(BaseModel):
    name: str
    owner_id: int

class ProjectResponse(BaseModel):
    id: int
    name: str
    owner_id: int

    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    email: str
    name: str

class UserResponse(BaseModel):
    id: int
    email: str
    name: str

    class Config:
        from_attributes = True

class ProjectStats(BaseModel):
    project_id: int
    project_name: str
    total_tasks: int
    pending_tasks: int
    in_progress_tasks: int
    completed_tasks: int

class QuickAddRequest(BaseModel):
    description: str
    project_id: int

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# FastAPI app
app = FastAPI(title="TaskFlow API", version="1.0.0")

# Middleware for logging
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = (time.time() - start_time) * 1000
    print(f"{request.method} {request.url.path} - {process_time:.2f}ms")
    return response

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5500",
        "http://127.0.0.1:5500",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Basic health-check endpoints
@app.get("/")
def root():
    return {
        "status": "success",
        "message": "TaskFlow API is running successfully 🚀"
    }

@app.get("/home")
def home():
    return {"message": "Server is working!"}

@app.get("/health")
def health():
    return {"status": "ok", "database": "connected"}

# CRUD Endpoints for Users
@app.post("/users", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    db_user = User(email=user.email, name=user.name)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.get("/users", response_model=List[UserResponse])
def list_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return users

# CRUD Endpoints for Projects
@app.post("/projects", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_project(project: ProjectCreate, db: Session = Depends(get_db)):
    db_project = Project(name=project.name, owner_id=project.owner_id)
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

@app.get("/projects", response_model=List[ProjectResponse])
def list_projects(db: Session = Depends(get_db)):
    projects = db.query(Project).all()
    return projects

# CRUD Endpoints for Tasks
@app.post("/tasks", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    db_task = Task(**task.model_dump())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@app.get("/tasks", response_model=List[TaskResponse])
def list_tasks(db: Session = Depends(get_db)):
    tasks = db.query(Task).all()
    return tasks

@app.get("/tasks/{task_id}", response_model=TaskResponse)
def get_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@app.put("/tasks/{task_id}", response_model=TaskResponse)
def update_task(task_id: int, task: TaskUpdate, db: Session = Depends(get_db)):
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    for key, value in task.model_dump(exclude_unset=True).items():
        setattr(db_task, key, value)
    db.commit()
    db.refresh(db_task)
    return db_task

@app.delete("/tasks/{task_id}", status_code=status.HTTP_200_OK)
def delete_task(task_id: int, db: Session = Depends(get_db)):
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(db_task)
    db.commit()
    return {"message": "Task deleted successfully"}

# Statistics endpoint
@app.get("/projects/stats", response_model=List[ProjectStats])
def get_project_stats(db: Session = Depends(get_db)):
    stats = db.query(
        Project.id.label("project_id"),
        Project.name.label("project_name"),
        func.count(Task.id).label("total_tasks"),
        func.sum(case((Task.status == "pending", 1), else_=0)).label("pending_tasks"),
        func.sum(case((Task.status == "in_progress", 1), else_=0)).label("in_progress_tasks"),
        func.sum(case((Task.status == "completed", 1), else_=0)).label("completed_tasks")
    ).join(Task, Project.id == Task.project_id).group_by(Project.id, Project.name).all()

    result = []
    for stat in stats:
        result.append(ProjectStats(
            project_id=stat.project_id,
            project_name=stat.project_name,
            total_tasks=stat.total_tasks or 0,
            pending_tasks=stat.pending_tasks or 0,
            in_progress_tasks=stat.in_progress_tasks or 0,
            completed_tasks=stat.completed_tasks or 0
        ))
    return result

# Quick-add endpoint
@app.post("/tasks/quick-add", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def quick_add_task(request: QuickAddRequest, db: Session = Depends(get_db)):
    # Check if project exists
    project = db.query(Project).filter(Project.id == request.project_id).first()
    if not project:
        raise HTTPException(status_code=422, detail="Project not found")

    # Parse the description
    parsed = parse_description(request.description)

    # Create task
    task_data = TaskCreate(
        title=parsed["title"],
        priority=parsed["priority"],
        due_date=parsed["due_date_hint"],
        project_id=request.project_id
    )
    db_task = Task(**task_data.model_dump())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

# Mock parser function
def parse_description(description: str) -> Dict[str, Any]:
    """Parse a free-text description into structured task fields."""
    lower_desc = description.lower()

    # Determine priority
    priority = "medium"
    if "urgent" in lower_desc or "asap" in lower_desc:
        priority = "high"
    elif "whenever" in lower_desc or "low priority" in lower_desc:
        priority = "low"

    # Determine due date
    due_date_hint = None
    date_keywords = [
        "today", "tomorrow", "next week", "next monday", "next tuesday", "next wednesday", "next thursday", "next friday", "next saturday", "next sunday",
        "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"
    ]
    for keyword in date_keywords:
        if keyword in lower_desc:
            due_date_hint = keyword
            break

    # Strip keywords from title
    title = description

    # Remove priority keywords
    for keyword in ["urgent", "asap", "whenever", "low priority"]:
        title = title.replace(keyword, "")

    # Remove date keywords
    if due_date_hint:
        title = title.replace(due_date_hint, "")

    # Clean up title
    title = title.strip()
    if not title:
        title = "Untitled task"

    return {
        "title": title,
        "priority": priority,
        "due_date_hint": due_date_hint
    }