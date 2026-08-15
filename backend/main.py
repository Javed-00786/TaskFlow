from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from sqlalchemy import (
    create_engine,
    Column,
    Integer,
    String,
    Text,
    ForeignKey,
    func,
    case
)

from sqlalchemy.orm import (
    sessionmaker,
    relationship,
    Session,
    declarative_base
)

from pydantic import BaseModel, Field, field_validator

from typing import List, Optional, Dict, Any

import time
import os


# =========================================================
# FASTAPI APPLICATION
# =========================================================

app = FastAPI(
    title="TaskFlow API",
    version="1.0.0"
)


# =========================================================
# FRONTEND CONFIGURATION
# =========================================================

FRONTEND_DIR = os.path.join(
    os.path.dirname(
        os.path.dirname(
            os.path.abspath(__file__)
        )
    ),
    "frontend"
)


app.mount(
    "/static",
    StaticFiles(directory=FRONTEND_DIR),
    name="static"
)


@app.get("/", include_in_schema=False)
def serve_frontend():

    return FileResponse(
        os.path.join(
            FRONTEND_DIR,
            "index.html"
        )
    )


# =========================================================
# DATABASE CONFIGURATION
# =========================================================

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./taskflow.db"
)


# Render / PostgreSQL compatibility
if DATABASE_URL.startswith("postgres://"):

    DATABASE_URL = DATABASE_URL.replace(
        "postgres://",
        "postgresql://",
        1
    )


# =========================================================
# DATABASE ENGINE
# =========================================================

if DATABASE_URL.startswith("postgresql://"):

    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True
    )

else:

    # SQLite for local development
    engine = create_engine(
        DATABASE_URL,
        connect_args={
            "check_same_thread": False
        }
    )


SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


Base = declarative_base()


# =========================================================
# SQLALCHEMY MODELS
# =========================================================

class User(Base):

    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    email = Column(
        String,
        unique=True,
        nullable=False
    )

    name = Column(
        String,
        nullable=False
    )

    projects = relationship(
        "Project",
        back_populates="owner"
    )


class Project(Base):

    __tablename__ = "projects"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String,
        nullable=False
    )

    owner_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    owner = relationship(
        "User",
        back_populates="projects"
    )

    tasks = relationship(
        "Task",
        back_populates="project",
        cascade="all, delete-orphan"
    )


class Task(Base):

    __tablename__ = "tasks"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    title = Column(
        String,
        nullable=False
    )

    description = Column(
        Text,
        nullable=True
    )

    priority = Column(
        String,
        nullable=False
    )

    due_date = Column(
        String,
        nullable=True
    )

    status = Column(
        String,
        default="pending"
    )

    project_id = Column(
        Integer,
        ForeignKey("projects.id"),
        nullable=False
    )

    project = relationship(
        "Project",
        back_populates="tasks"
    )


# =========================================================
# CREATE DATABASE TABLES
# =========================================================

Base.metadata.create_all(
    bind=engine
)


# =========================================================
# CREATE DEFAULT USER AND PROJECT
# =========================================================

def create_default_data():

    db = SessionLocal()

    try:

        # -------------------------------------------------
        # Find default user
        # -------------------------------------------------

        user = db.query(User).filter(
            User.email == "demo@taskflow.com"
        ).first()


        # -------------------------------------------------
        # Create default user if missing
        # -------------------------------------------------

        if not user:

            user = User(
                email="demo@taskflow.com",
                name="TaskFlow User"
            )

            db.add(user)

            db.commit()

            db.refresh(user)

            print(
                "Default user created:",
                user.id
            )

        else:

            print(
                "Default user already exists:",
                user.id
            )


        # -------------------------------------------------
        # Find project
        # -------------------------------------------------

        project = db.query(Project).first()


        # -------------------------------------------------
        # Create default project if missing
        # -------------------------------------------------

        if not project:

            project = Project(
                name="My TaskFlow Project",
                owner_id=user.id
            )

            db.add(project)

            db.commit()

            db.refresh(project)

            print(
                "Default project created:",
                project.id
            )

        else:

            print(
                "Project already exists:",
                project.id,
                project.name
            )


    except Exception as e:

        db.rollback()

        print(
            "ERROR creating default data:",
            str(e)
        )


    finally:

        db.close()


# =========================================================
# INITIALIZE DEFAULT DATA
# =========================================================

create_default_data()


# =========================================================
# PYDANTIC MODELS
# =========================================================

class TaskCreate(BaseModel):

    title: str

    description: Optional[str] = None

    priority: str = Field(
        ...,
        pattern="^(low|medium|high)$"
    )

    due_date: Optional[str] = None

    status: str = "pending"

    project_id: int


    @field_validator("title")
    @classmethod
    def validate_title(cls, v):

        if not v or not v.strip():

            raise ValueError(
                "Title cannot be empty or whitespace only"
            )

        return v.strip()


class TaskUpdate(BaseModel):

    title: Optional[str] = None

    description: Optional[str] = None

    priority: Optional[str] = Field(
        None,
        pattern="^(low|medium|high)$"
    )

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


# =========================================================
# DATABASE DEPENDENCY
# =========================================================

def get_db():

    db = SessionLocal()

    try:

        yield db

    finally:

        db.close()


# =========================================================
# REQUEST LOGGING MIDDLEWARE
# =========================================================

@app.middleware("http")
async def log_requests(
    request: Request,
    call_next
):

    start_time = time.time()

    response = await call_next(request)

    process_time = (
        time.time() - start_time
    ) * 1000

    print(
        f"{request.method} "
        f"{request.url.path} "
        f"- {process_time:.2f}ms"
    )

    return response


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5500",
        "http://127.0.0.1:5500",
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],

    allow_credentials=True,

    allow_methods=[
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "OPTIONS"
    ],

    allow_headers=["*"]
)


# =========================================================
# BASIC ENDPOINTS
# =========================================================

@app.get("/home")
def home():

    return {
        "message": "Server is working!"
    }


@app.get("/health")
def health(
    db: Session = Depends(get_db)
):

    try:

        db.execute(
            "SELECT 1"
        )

        return {
            "status": "ok",
            "database": "connected"
        }

    except Exception as e:

        return {
            "status": "error",
            "database": "disconnected",
            "error": str(e)
        }


# =========================================================
# USERS
# =========================================================

@app.post(
    "/users",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED
)
def create_user(
    user: UserCreate,
    db: Session = Depends(get_db)
):

    db_user = db.query(User).filter(
        User.email == user.email
    ).first()


    if db_user:

        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )


    db_user = User(
        email=user.email,
        name=user.name
    )


    db.add(db_user)

    db.commit()

    db.refresh(db_user)


    return db_user


@app.get(
    "/users",
    response_model=List[UserResponse]
)
def list_users(
    db: Session = Depends(get_db)
):

    return db.query(User).all()


# =========================================================
# PROJECTS
# =========================================================

@app.post(
    "/projects",
    response_model=ProjectResponse,
    status_code=status.HTTP_201_CREATED
)
def create_project(
    project: ProjectCreate,
    db: Session = Depends(get_db)
):

    # Check owner
    owner = db.query(User).filter(
        User.id == project.owner_id
    ).first()


    if not owner:

        raise HTTPException(
            status_code=404,
            detail="Owner user not found"
        )


    db_project = Project(
        name=project.name,
        owner_id=project.owner_id
    )


    db.add(db_project)

    db.commit()

    db.refresh(db_project)


    return db_project


@app.get(
    "/projects",
    response_model=List[ProjectResponse]
)
def list_projects(
    db: Session = Depends(get_db)
):

    projects = db.query(Project).all()

    # Safety check:
    # If somehow database is empty,
    # create default project again.

    if not projects:

        create_default_data()

        projects = db.query(Project).all()


    return projects


# =========================================================
# TASKS
# =========================================================

@app.post(
    "/tasks",
    response_model=TaskResponse,
    status_code=status.HTTP_201_CREATED
)
def create_task(
    task: TaskCreate,
    db: Session = Depends(get_db)
):

    # Verify project
    project = db.query(Project).filter(
        Project.id == task.project_id
    ).first()


    if not project:

        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )


    db_task = Task(
        **task.model_dump()
    )


    db.add(db_task)

    db.commit()

    db.refresh(db_task)


    return db_task


@app.get(
    "/tasks",
    response_model=List[TaskResponse]
)
def list_tasks(
    db: Session = Depends(get_db)
):

    return db.query(Task).all()


@app.get(
    "/tasks/{task_id}",
    response_model=TaskResponse
)
def get_task(
    task_id: int,
    db: Session = Depends(get_db)
):

    task = db.query(Task).filter(
        Task.id == task_id
    ).first()


    if not task:

        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )


    return task


@app.put(
    "/tasks/{task_id}",
    response_model=TaskResponse
)
def update_task(
    task_id: int,
    task: TaskUpdate,
    db: Session = Depends(get_db)
):

    db_task = db.query(Task).filter(
        Task.id == task_id
    ).first()


    if not db_task:

        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )


    update_data = task.model_dump(
        exclude_unset=True
    )


    # If project is being changed,
    # verify the new project exists.

    if "project_id" in update_data:

        new_project = db.query(Project).filter(
            Project.id == update_data["project_id"]
        ).first()


        if not new_project:

            raise HTTPException(
                status_code=404,
                detail="Project not found"
            )


    for key, value in update_data.items():

        setattr(
            db_task,
            key,
            value
        )


    db.commit()

    db.refresh(db_task)


    return db_task


@app.delete(
    "/tasks/{task_id}",
    status_code=status.HTTP_200_OK
)
def delete_task(
    task_id: int,
    db: Session = Depends(get_db)
):

    db_task = db.query(Task).filter(
        Task.id == task_id
    ).first()


    if not db_task:

        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )


    db.delete(db_task)

    db.commit()


    return {
        "message": "Task deleted successfully"
    }


# =========================================================
# PROJECT STATISTICS
# =========================================================

@app.get(
    "/projects/stats",
    response_model=List[ProjectStats]
)
def get_project_stats(
    db: Session = Depends(get_db)
):

    stats = db.query(

        Project.id.label(
            "project_id"
        ),

        Project.name.label(
            "project_name"
        ),

        func.count(
            Task.id
        ).label(
            "total_tasks"
        ),

        func.sum(
            case(
                (
                    Task.status == "pending",
                    1
                ),
                else_=0
            )
        ).label(
            "pending_tasks"
        ),

        func.sum(
            case(
                (
                    Task.status == "in_progress",
                    1
                ),
                else_=0
            )
        ).label(
            "in_progress_tasks"
        ),

        func.sum(
            case(
                (
                    Task.status == "completed",
                    1
                ),
                else_=0
            )
        ).label(
            "completed_tasks"
        )

    ).join(
        Task,
        Project.id == Task.project_id
    ).group_by(
        Project.id,
        Project.name
    ).all()


    result = []


    for stat in stats:

        result.append(
            ProjectStats(

                project_id=stat.project_id,

                project_name=stat.project_name,

                total_tasks=stat.total_tasks or 0,

                pending_tasks=(
                    stat.pending_tasks or 0
                ),

                in_progress_tasks=(
                    stat.in_progress_tasks or 0
                ),

                completed_tasks=(
                    stat.completed_tasks or 0
                )
            )
        )


    return result


# =========================================================
# AI QUICK ADD
# =========================================================

@app.post(
    "/tasks/quick-add",
    response_model=TaskResponse,
    status_code=status.HTTP_201_CREATED
)
def quick_add_task(
    request: QuickAddRequest,
    db: Session = Depends(get_db)
):

    # Check project
    project = db.query(Project).filter(
        Project.id == request.project_id
    ).first()


    if not project:

        raise HTTPException(
            status_code=422,
            detail="Project not found"
        )


    # Parse description
    parsed = parse_description(
        request.description
    )


    task_data = TaskCreate(

        title=parsed["title"],

        priority=parsed["priority"],

        due_date=parsed["due_date_hint"],

        project_id=request.project_id
    )


    db_task = Task(
        **task_data.model_dump()
    )


    db.add(db_task)

    db.commit()

    db.refresh(db_task)


    return db_task


# =========================================================
# QUICK ADD PARSER
# =========================================================

def parse_description(
    description: str
) -> Dict[str, Any]:

    lower_desc = description.lower()


    # -----------------------------------------------------
    # Priority
    # -----------------------------------------------------

    priority = "medium"


    if (
        "urgent" in lower_desc
        or "asap" in lower_desc
        or "high priority" in lower_desc
    ):

        priority = "high"


    elif (
        "whenever" in lower_desc
        or "low priority" in lower_desc
    ):

        priority = "low"


    # -----------------------------------------------------
    # Due Date
    # -----------------------------------------------------

    due_date_hint = None


    date_keywords = [

        "today",

        "tomorrow",

        "next week",

        "next monday",

        "next tuesday",

        "next wednesday",

        "next thursday",

        "next friday",

        "next saturday",

        "next sunday",

        "monday",

        "tuesday",

        "wednesday",

        "thursday",

        "friday",

        "saturday",

        "sunday"
    ]


    for keyword in date_keywords:

        if keyword in lower_desc:

            due_date_hint = keyword

            break


    # -----------------------------------------------------
    # Title
    # -----------------------------------------------------

    title = description


    # Remove priority keywords
    for keyword in [

        "urgent",

        "asap",

        "high priority",

        "whenever",

        "low priority"
    ]:

        title = title.replace(
            keyword,
            ""
        )


    # Remove date keyword
    if due_date_hint:

        title = title.replace(
            due_date_hint,
            ""
        )


    # Clean title
    title = title.strip()


    if not title:

        title = "Untitled task"


    return {

        "title": title,

        "priority": priority,

        "due_date_hint": due_date_hint
    }