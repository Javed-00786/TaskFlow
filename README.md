 🚀 TaskFlow

## Full-Stack AI-Assisted Task Management Platform

TaskFlow is a full-stack task management platform designed to help users organize projects, create and manage tasks, track priorities, and monitor task progress through a clean and intuitive dashboard.

The platform also includes an AI-assisted **Quick Add** feature that converts natural-language task descriptions into structured tasks.

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
- Assign tasks to projects
- Select projects from a dropdown
- Filter tasks by project
- Manage multiple projects

### 🤖 AI Quick Add

TaskFlow provides an AI-assisted Quick Add feature that allows users to create tasks using natural-language descriptions.

**Example:**

```text
Finish backend tomorrow urgent

The system can identify:

Task: Finish backend
Priority: High
Due Date: Tomorrow
📊 Dashboard

The TaskFlow dashboard provides an overview of your tasks and projects.

Dashboard Metrics
Metric	Description
Total Tasks	Total number of tasks
High Priority	Number of high-priority tasks
Medium Priority	Number of medium-priority tasks
Low Priority	Number of low-priority tasks
Completed	Number of completed tasks
Pending	Number of pending tasks
Projects	Number of available projects
🔎 Search

TaskFlow includes a task search feature that allows users to quickly find tasks by title.

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
⚙️ Installation
1. Clone the Repository
git clone https://github.com/Javed-00786/TaskFlow.git
2. Navigate to the Project
cd TaskFlow
3. Create a Virtual Environment
Windows
python -m venv venv
venv\Scripts\activate
Linux / macOS
python3 -m venv venv
source venv/bin/activate
4. Install Dependencies
pip install -r requirements.txt
🗄️ Database
Local Development

TaskFlow can use SQLite for local development.

Default database:

sqlite:///./taskflow.db
Production

Production deployment uses PostgreSQL through the DATABASE_URL environment variable.

Example:

DATABASE_URL=your_postgresql_database_url

Never commit database credentials or secrets to GitHub.

▶️ Running the Application

Start the FastAPI application:

uvicorn backend.main:app --reload

The application will be available at:

http://127.0.0.1:8000

📚 API Documentation

TaskFlow uses FastAPI's automatic API documentation.

After starting the application, open:

http://127.0.0.1:8000/docs

This provides an interactive Swagger UI for testing the API.

Alternative documentation:

http://127.0.0.1:8000/redoc

🔌 API Endpoints
👤 Users
Method	Endpoint	Description
POST	/users	Create a user
GET	/users	Get all users
📁 Projects
Method	Endpoint	Description
POST	/projects	Create a project
GET	/projects	Get all projects
GET	/projects/stats	Get project statistics
📋 Tasks
Method	Endpoint	Description
POST	/tasks	Create a task
GET	/tasks	Get all tasks
GET	/tasks/{task_id}	Get a specific task
PUT	/tasks/{task_id}	Update a task
DELETE	/tasks/{task_id}	Delete a task
POST	/tasks/quick-add	Create a task using Quick Add
❤️ Health
Method	Endpoint	Description
GET	/health	Check API and database status
GET	/home	Check server status
🤖 AI Quick Add

Quick Add allows users to create tasks using natural-language descriptions.

Example Request
{
  "description": "Finish backend tomorrow urgent",
  "project_id": 1
}
Example Result
Title: Finish backend
Priority: High
Due Date: Tomorrow
Project ID: 1
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

Screenshots of the TaskFlow application can be added here.

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

Built with ❤️ using Python, FastAPI, SQLAlchemy, PostgreSQL, JavaScript and Render.
