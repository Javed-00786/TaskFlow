# 🚀 TaskFlow

## Full-Stack AI-Assisted Task Management Platform

TaskFlow is a full-stack task management platform designed to help users organize projects, create and manage tasks, track priorities, and monitor task progress through a clean and intuitive dashboard.

The platform also includes an AI-assisted **Quick Add** feature that converts natural-language task descriptions into structured tasks.

---

## 🌐 Live Demo

🔗 **Live Application:**  
https://taskflow-full-stack-ai-assisted-task.onrender.com

🔗 **GitHub Repository:**  
https://github.com/Javed-00786/TaskFlow

---

## ✨ Features

### 📋 Task Management

- Create tasks
- Edit tasks
- Delete tasks
- Search tasks by title
- Add task descriptions
- Set task priority
- Set due dates
- Track task status

### 📁 Project Management

- Create projects
- View available projects
- Assign tasks to projects
- Select projects from a dropdown
- Filter tasks by project

### 🤖 AI Quick Add

TaskFlow allows users to create tasks using natural-language descriptions.


📊 Dashboard

The dashboard provides task statistics including:

Total Tasks
High Priority Tasks
Medium Priority Tasks
Low Priority Tasks
Completed Tasks
Pending Tasks
Projects
🔎 Search

Users can quickly search tasks by title.

☁️ Deployment

The application is deployed on Render and can be accessed through the live demo.

🛠️ Tech Stack
Frontend
HTML5
CSS3
JavaScript
Backend
Python
FastAPI
Pydantic
SQLAlchemy
Database
PostgreSQL
SQLite for local development
Deployment
Render
Version Control
Git
GitHub
🏗️ Project Structure
TaskFlow/
│
├── backend/
│   └── main.py
│
├── frontend/
│   ├── index.html
│   ├── script.js
│   └── styles.css
│
├── benchmark.py
├── check_algorithms.py
├── requirements.txt
├── .gitignore
└── README.md
⚙️ Installation & Setup
1. Clone the Repository
git clone https://github.com/Javed-00786/TaskFlow.git

Navigate into the project:

cd TaskFlow
2. Create a Virtual Environment
Windows
python -m venv venv

Activate the environment:

venv\Scripts\activate
Linux / macOS
python3 -m venv venv

Activate:

source venv/bin/activate
3. Install Dependencies
pip install -r requirements.txt
🗄️ Database Configuration

For local development, TaskFlow can use SQLite.

Default database:

sqlite:///./taskflow.db

For production deployment, configure PostgreSQL using the DATABASE_URL environment variable.

▶️ Running the Application

Start the FastAPI server:

uvicorn backend.main:app --reload

The application will be available at:

http://127.0.0.1:8000

Open the application in your browser:

http://127.0.0.1:8000
📚 API Documentation

TaskFlow uses FastAPI's automatic API documentation.

After starting the backend, open:

http://127.0.0.1:8000/docs

This provides an interactive Swagger UI where you can test the API endpoints.

🔌 API Endpoints
Users
Method	Endpoint	Description
POST	/users	Create a user
GET	/users	Get all users
Projects
Method	Endpoint	Description
POST	/projects	Create a project
GET	/projects	Get all projects
GET	/projects/stats	Get project statistics
Tasks
Method	Endpoint	Description
POST	/tasks	Create a task
GET	/tasks	Get all tasks
GET	/tasks/{task_id}	Get a task
PUT	/tasks/{task_id}	Update a task
DELETE	/tasks/{task_id}	Delete a task
POST	/tasks/quick-add	Create a task using Quick Add
🤖 AI Quick Add Example
Request
{
  "description": "Finish backend tomorrow urgent",
  "project_id": 1
}
Result
Title: Finish backend
Priority: High
Due Date: Tomorrow
Project ID: 1
📊 Dashboard

TaskFlow provides a dashboard for monitoring task activity.

The dashboard displays:

Metric	Description
Total Tasks	Total number of tasks
High Priority	High-priority tasks
Medium Priority	Medium-priority tasks
Low Priority	Low-priority tasks
Completed	Completed tasks
Pending	Pending tasks
Projects	Available projects
☁️ Deployment

TaskFlow is deployed using Render.

Build Command
pip install -r requirements.txt
Start Command
uvicorn backend.main:app --host 0.0.0.0 --port $PORT
Environment Variable
DATABASE_URL
🔐 Security

The project follows basic security practices:

Environment variables for sensitive configuration
.gitignore for local and sensitive files
Server-side validation using Pydantic
Database operations using SQLAlchemy
API error handling

Production credentials and secrets should never be stored directly in source code.

This project demonstrates practical experience with:

Full-stack web development
REST API development
FastAPI
Python
SQLAlchemy ORM
PostgreSQL
SQLite
JavaScript
CRUD operations
API integration
Natural-language task parsing
Git and GitHub


👨‍💻 Author
Mohd Javed

GitHub:
https://github.com/Javed-00786
