# 🚀 TaskFlow

## Full-Stack AI-Assisted Task Management Platform

TaskFlow is a full-stack task and project management platform designed to help users organize projects, create and manage tasks, track priorities, monitor progress, and work through a clean web dashboard.

The platform also includes an AI-assisted **Quick Add** feature that parses plain-English task descriptions into structured task records.

---

## 🌐 Live Demo

**Live Application:**  
https://taskflow-full-stack-ai-assisted-task.onrender.com

**GitHub Repository:**  
https://github.com/Javed-00786/TaskFlow


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
- Assign tasks to projects

### 📁 Project Management

- Create projects
- View available projects
- Select projects from a dropdown
- Assign tasks to projects
- Filter tasks by project
- Manage multiple projects

### 🤖 AI Quick Add

TaskFlow provides an AI-assisted **Quick Add** feature that converts natural-language descriptions into structured task information.

**Example input:**
Finish the report next Friday, it's urgent

# 🚀 TaskFlow

## Full-Stack AI-Assisted Task Management Platform

TaskFlow is a full-stack task and project management platform designed to help users organize projects, create and manage tasks, track priorities, monitor progress, and work through a clean web dashboard.

The platform also includes an AI-assisted **Quick Add** feature that parses plain-English task descriptions into structured task records.

---

## 🌐 Live Demo

**Live Application:**  
https://taskflow-full-stack-ai-assisted-task.onrender.com

**GitHub Repository:**  
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
- Assign tasks to projects

### 📁 Project Management

- Create projects
- View available projects
- Select projects from a dropdown
- Assign tasks to projects
- Filter tasks by project
- Manage multiple projects

### 🤖 AI Quick Add

TaskFlow provides an AI-assisted **Quick Add** feature that converts natural-language descriptions into structured task information.

**Example input:**

Finish the report next Friday, it's urgent

# 🚀 TaskFlow

## Full-Stack AI-Assisted Task Management Platform

TaskFlow is a full-stack task and project management platform designed to help users organize projects, create and manage tasks, track priorities, monitor progress, and work through a clean web dashboard.

The platform also includes an AI-assisted **Quick Add** feature that parses plain-English task descriptions into structured task records.

---

## 🌐 Live Demo

**Live Application:**  
https://taskflow-full-stack-ai-assisted-task.onrender.com

**GitHub Repository:**  
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
- Assign tasks to projects

### 📁 Project Management

- Create projects
- View available projects
- Select projects from a dropdown
- Assign tasks to projects
- Filter tasks by project
- Manage multiple projects

### 🤖 AI Quick Add

TaskFlow provides an AI-assisted **Quick Add** feature that converts natural-language descriptions into structured task information.

**Example input:**

Finish the report next Friday, it's urgent
{
  "title": "Finish the report , it's",
  "priority": "high",
  "due_date_hint": "next friday"
}

📊 Dashboard

The TaskFlow dashboard provides an overview of task and project activity.
| Metric          | Description                                             |
| --------------- | ------------------------------------------------------- |
| Total Tasks     | Total number of tasks                                   |
| High Priority   | Number of high-priority tasks                           |
| Medium Priority | Number of medium-priority tasks                         |
| Low Priority    | Number of low-priority tasks                            |
| Completed       | Number of completed tasks                               |
| Pending         | Number of pending tasks                                 |
| Projects        | Number of projects represented in the current task view |

🔎 Search

TaskFlow includes task search functionality that allows users to quickly find tasks by title.

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
Uvicorn
Database
SQLite for local development
PostgreSQL for production deployment
Deployment & Version Control
Render
Git
GitHub

🏗️ Project Structure
TaskFlow/
│
├── backend/
│   ├── main.py
│   └── algorithms.py
│
├── frontend/
│   ├── index.html
│   ├── styles.css
│   └── script.js
│
├── benchmark.py
├── check_algorithms.py
├── requirements.txt
├── .gitignore
└── README.md

⚙️ Installation & Setup
1. Clone the Repository
   git clone https://github.com/Javed-00786/TaskFlow.git
cd TaskFlow

2. Create a Virtual Environment
   python -m venv venv
venv\Scripts\activate

3. Install Dependencies
pip install -r requirements.txt
🗄️ Database
Local Development

TaskFlow uses SQLite for local development.

Default database URL:

sqlite:///./taskflow.db
Production

Production deployment can use PostgreSQL through the DATABASE_URL environment variable.

Example:

DATABASE_URL=your_postgresql_database_url

Never commit database credentials, API keys, passwords, or other secrets to GitHub.

▶️ Running the Application
Single-Process Run

The FastAPI backend can serve the frontend as configured in the application.

From the project root:

uvicorn backend.main:app --reload

Open:

http://127.0.0.1:8000
Two-Process Development Run

If running the frontend separately:

Backend
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
Frontend

Open another terminal:

cd frontend
python -m http.server 5500

Then open:

http://localhost:5500
📚 API Documentation

TaskFlow uses FastAPI's automatic API documentation.

Swagger UI
http://127.0.0.1:8000/docs
ReDoc
http://127.0.0.1:8000/redoc

Swagger UI provides an interactive interface for testing API endpoints.

🔌 API Endpoints
👤 Users
Method	Endpoint	Description
POST	/users	Create a new user
GET	/users	List all users
📁 Projects
Method	Endpoint	Description
POST	/projects	Create a new project
GET	/projects	List all projects
GET	/projects/stats	Get project statistics
📋 Tasks
Method	Endpoint	Description
POST	/tasks	Create a new task
GET	/tasks	List all tasks
GET	/tasks/{task_id}	Get a task by ID
PUT	/tasks/{task_id}	Update a task
DELETE	/tasks/{task_id}	Delete a task
POST	/tasks/quick-add	Create a task using Quick Add
❤️ Health
Method	Endpoint	Description
GET	/health	Check API/database status
GET	/home	Check server status
🔍 Algorithm Endpoints
Method	Endpoint	Description
GET	/tasks/sorted?sort=priority	Sort tasks by priority
GET	/tasks/sorted?sort=due_date	Sort tasks by due date
GET	/tasks/search?title=exact_title&algo=binary	Search using binary search
GET	/tasks/search?title=exact_title&algo=linear	Search using linear search
🤖 AI Quick Add

Quick Add creates a task from a natural-language description.

Example Request
{
  "description": "Finish the report next Friday, it's urgent",
  "project_id": 1
}
Example Result
Title: Finish the report , it's
Priority: high
Due Date: next friday
Project ID: 1

The current implementation uses a deterministic parser, so it does not require an external AI API or network connection.

🧠 Algorithms Engine

TaskFlow includes sorting and searching algorithms used by dedicated API endpoints.

Sorting
Insertion Sort
Searching
Binary Search
Linear Search
Time Complexity
Algorithm	Complexity
Insertion Sort — Worst Case	O(n²)
Insertion Sort — Best Case	O(n)
Binary Search	O(log n)
Linear Search	O(n)
📈 Benchmark Results

The project includes benchmark.py for measuring algorithm performance.

Example benchmark results:

Dataset	Insertion Sort Comparisons	Binary Search Existing	Binary Search Missing	Linear Search Existing	Linear Search Missing
10 tasks	45	4	4	1	10
500 tasks	124,750	9	9	1	500
3,000 tasks	4,498,500	12	12	1	3,000

Run the benchmark:

python benchmark.py

Run algorithm correctness checks:

python check_algorithms.py
🗃️ Database Schema

The application uses three related tables.

Users
Column	Type	Description
id	INTEGER	Primary key
email	VARCHAR	Unique user email
name	VARCHAR	User name
Projects
Column	Type	Description
id	INTEGER	Primary key
name	VARCHAR	Project name
owner_id	INTEGER	Foreign key to users
Tasks
Column	Type	Description
id	INTEGER	Primary key
title	VARCHAR	Task title
description	TEXT	Task description
priority	VARCHAR	low, medium, or high
due_date	VARCHAR	Due date stored as text
status	VARCHAR	pending, in_progress, or completed
project_id	INTEGER	Foreign key to projects
☁️ Deployment

TaskFlow is deployed using Render.

Build Command
pip install -r requirements.txt
Start Command
uvicorn backend.main:app --host 0.0.0.0 --port $PORT
Environment Variable
DATABASE_URL
Live Application

https://taskflow-full-stack-ai-assisted-task.onrender.com

🔐 Security

The project follows basic security practices:

Environment variables for sensitive configuration
.gitignore for local and sensitive files
Server-side validation using Pydantic
SQLAlchemy for database operations
API error handling
Input validation

Production credentials and secrets should never be stored directly in source code.

🎯 Project Highlights

TaskFlow demonstrates practical experience with:

Full-stack web development
REST API development
Python
FastAPI
SQLAlchemy ORM
PostgreSQL
SQLite
JavaScript
HTML5
CSS3
CRUD operations
API integration
Project management
Task management
Natural-language task parsing
Sorting and searching algorithms
Git
GitHub
Render deployment
🚧 Future Improvements

Planned improvements may include:

User authentication
JWT authentication
Role-based access control
Advanced AI task parsing
Task completion controls
Calendar integration
Notifications and reminders
Advanced analytics
Dark mode
Automated testing
CI/CD pipeline
📸 Screenshots

Add screenshots of the TaskFlow dashboard and task-management interface here.

Example:

screenshots/
├── dashboard.png
├── task-management.png
└── projects.png
👨‍💻 Author
Mohd Javed

Full-Stack Developer | Python | FastAPI | JavaScript

GitHub:
https://github.com/Javed-00786

TaskFlow Repository:
https://github.com/Javed-00786/TaskFlow

📄 License

This project is created for educational, portfolio, and demonstration purposes.

⭐ Support

If you find TaskFlow useful, consider giving the repository a ⭐ on GitHub.

Built with ❤️ using Python, FastAPI, SQLAlchemy, JavaScript, GitHub and Render.
