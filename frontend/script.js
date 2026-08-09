document.addEventListener('DOMContentLoaded', function() {
    var taskForm = document.getElementById('taskForm');
    var taskList = document.getElementById('taskList');
    var titleError = document.getElementById('titleError');
    
    // Load from localStorage first
    var cachedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    cachedTasks.forEach(function(task) {
        renderTask(task);
    });
    
    // Load tasks from backend
    fetchTasks();
    
    // Task form submission
    taskForm.addEventListener('submit', function(e) {
        e.preventDefault();
        titleError.textContent = '';
        
        var titleInput = document.getElementById('title');
        var title = titleInput.value.trim();
        
        if (!title) {
            titleError.textContent = 'Title is required';
            return;
        }
        
        var description = document.getElementById('description').value.trim();
        var priority = document.getElementById('priority').value;
        
        fetch('/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title: title, description: description, priority: priority })
        }).then(function(response) {
            if (response.ok) {
                return response.json();
            }
            return response.json().then(function(errorData) {
                alert(errorData.detail);
                throw new Error('Failed to add task');
            });
        }).then(function(newTask) {
            renderTask(newTask);
            saveTasksToLocalStorage();
            titleInput.value = '';
        }).catch(function(error) {
            console.error('Error:', error);
            alert('Failed to add task');
        });
    });
    
    // Load tasks from backend
    function fetchTasks() {
        fetch('/tasks').then(function(response) {
            return response.json();
        }).then(function(tasks) {
            taskList.innerHTML = '';
            tasks.forEach(function(task) {
                renderTask(task);
            });
        }).catch(function(error) {
            console.error('Failed to fetch tasks:', error);
        });
    }
    
    // Render a single task
    function renderTask(task) {
        var taskItem = document.createElement('li');
        taskItem.className = 'task-item';
        if (task.completed) {
            taskItem.classList.add('completed');
        }
        taskItem.dataset.id = task.id;
        
        var taskText = document.createElement('span');
        taskText.className = 'task-text';
        taskText.textContent = task.title;
        
        var taskActions = document.createElement('div');
        taskActions.className = 'task-actions';
        
        var editButton = document.createElement('button');
        editButton.className = 'edit-btn';
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', function() {
            editTask(task.id);
        });
        
        var deleteButton = document.createElement('button');
        deleteButton.className = 'delete-btn';
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', function() {
            deleteTask(task.id);
        });
        
        taskActions.appendChild(editButton);
        taskActions.appendChild(deleteButton);
        
        taskItem.appendChild(taskText);
        taskItem.appendChild(taskActions);
        taskList.appendChild(taskItem);
    }
    
    // Edit task
    function editTask(taskId) {
        var taskItem = taskList.querySelector('[data-id="' + taskId + '"]');
        if (!taskItem) return;
        
        var taskText = taskItem.querySelector('.task-text');
        var newText = prompt('Edit task title:', taskText.textContent);
        if (newText && newText.trim()) {
            updateTask(taskId, newText.trim());
        }
    }
    
    // Update task via backend
    function updateTask(taskId, newTitle) {
        fetch('/tasks/' + taskId, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title: newTitle })
        }).then(function(response) {
            if (response.ok) {
                return response.json();
            }
            return response.json().then(function(errorData) {
                alert(errorData.detail);
                throw new Error('Failed to update task');
            });
        }).then(function(updatedTask) {
            var taskItem = taskList.querySelector('[data-id="' + taskId + '"]');
            if (taskItem) {
                taskList.removeChild(taskItem);
                renderTask(updatedTask);
            }
            saveTasksToLocalStorage();
        }).catch(function(error) {
            console.error('Error updating task:', error);
            alert('Failed to update task');
        });
    }
    
    // Delete task
    function deleteTask(taskId) {
        if (confirm('Are you sure you want to delete this task?')) {
            fetch('/tasks/' + taskId, {
                method: 'DELETE'
            }).then(function(response) {
                if (response.ok) {
                    var taskItem = taskList.querySelector('[data-id="' + taskId + '"]');
                    if (taskItem) {
                        taskList.removeChild(taskItem);
                    }
                    saveTasksToLocalStorage();
                } else {
                    return response.json().then(function(errorData) {
                        alert(errorData.detail);
                    });
                }
            }).catch(function(error) {
                console.error('Error deleting task:', error);
                alert('Failed to delete task');
            });
        }
    }
    
    // Save tasks to localStorage
    function saveTasksToLocalStorage() {
        var tasks = [];
        var items = taskList.children;
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            tasks.push({
                id: item.dataset.id || Date.now(),
                title: item.querySelector('.task-text').textContent,
                completed: item.classList.contains('completed')
            });
        }
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    // Fetch tasks from backend and update localStorage
    function fetchAndUpdateTasks() {
        fetch('/tasks').then(function(response) {
            return response.json();
        }).then(function(tasks) {
            localStorage.setItem('tasks', JSON.stringify(tasks));
            taskList.innerHTML = '';
            tasks.forEach(function(task) {
                renderTask(task);
            });
        }).catch(function(error) {
            console.error('Failed to fetch tasks:', error);
        });
    }
    
    // Initial fetch
    fetchAndUpdateTasks();
});