document.addEventListener('DOMContentLoaded', function () {

    var taskForm = document.getElementById('taskForm');
    var taskList = document.getElementById('taskList');
    var titleError = document.getElementById('titleError');

    var projectId = null;

    // -----------------------------
    // Start application
    // -----------------------------
    initializeApp();

    async function initializeApp() {
        try {
            projectId = await getOrCreateProject();

            if (projectId) {
                await fetchTasks();
            }

        } catch (error) {
            console.error('Initialization error:', error);
            showError(error);
        }
    }

    // -----------------------------
    // Get existing project
    // Create one if none exists
    // -----------------------------
    async function getOrCreateProject() {

        var response = await fetch('/projects');

        if (!response.ok) {
            throw new Error('Unable to load projects');
        }

        var projects = await response.json();

        // If project already exists
        if (projects.length > 0) {
            return projects[0].id;
        }

        // -----------------------------
        // Create default user
        // -----------------------------
        var userResponse = await fetch('/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'demo@taskflow.com',
                name: 'TaskFlow User'
            })
        });

        var user;

        if (userResponse.ok) {
            user = await userResponse.json();
        } else {
            // User may already exist
            var usersResponse = await fetch('/users');

            if (!usersResponse.ok) {
                throw new Error('Unable to load users');
            }

            var users = await usersResponse.json();

            if (users.length === 0) {
                throw new Error('No user available');
            }

            user = users[0];
        }

        // -----------------------------
        // Create default project
        // -----------------------------
        var projectResponse = await fetch('/projects', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: 'My TaskFlow Project',
                owner_id: user.id
            })
        });

        if (!projectResponse.ok) {
            var errorData = await projectResponse.json();
            throw new Error(formatError(errorData));
        }

        var project = await projectResponse.json();

        return project.id;
    }

    // -----------------------------
    // Add Task
    // -----------------------------
    taskForm.addEventListener('submit', async function (e) {

        e.preventDefault();

        titleError.textContent = '';

        var titleInput = document.getElementById('title');
        var title = titleInput.value.trim();

        if (!title) {
            titleError.textContent = 'Title is required';
            return;
        }

        if (!projectId) {
            alert('Project is not ready. Please try again.');
            return;
        }

        var description =
            document.getElementById('description').value.trim();

        var priority =
            document.getElementById('priority').value;

        try {

            var response = await fetch('/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: title,
                    description: description,
                    priority: priority,
                    status: 'pending',
                    project_id: projectId
                })
            });

            var data = await response.json();

            if (!response.ok) {
                throw new Error(formatError(data));
            }

            renderTask(data);

            titleInput.value = '';
            document.getElementById('description').value = '';

        } catch (error) {

            console.error('Error adding task:', error);

            alert(error.message || 'Failed to add task');
        }
    });

    // -----------------------------
    // Load Tasks
    // -----------------------------
    async function fetchTasks() {

        try {

            var response = await fetch('/tasks');

            if (!response.ok) {
                throw new Error('Unable to load tasks');
            }

            var tasks = await response.json();

            taskList.innerHTML = '';

            tasks.forEach(function (task) {
                renderTask(task);
            });

        } catch (error) {

            console.error('Failed to fetch tasks:', error);
        }
    }

    // -----------------------------
    // Render Task
    // -----------------------------
    function renderTask(task) {

        var taskItem = document.createElement('li');

        taskItem.className = 'task-item';

        if (task.status === 'completed') {
            taskItem.classList.add('completed');
        }

        taskItem.dataset.id = task.id;

        // Task text
        var taskText = document.createElement('span');

        taskText.className = 'task-text';

        taskText.textContent = task.title;

        // Priority
        var priorityBadge = document.createElement('span');

        priorityBadge.textContent = task.priority;

        priorityBadge.className =
            'priority-' + task.priority;

        // Actions
        var taskActions = document.createElement('div');

        taskActions.className = 'task-actions';

        // Edit button
        var editButton = document.createElement('button');

        editButton.className = 'edit-btn';

        editButton.textContent = 'Edit';

        editButton.addEventListener('click', function () {
            editTask(task.id);
        });

        // Delete button
        var deleteButton = document.createElement('button');

        deleteButton.className = 'delete-btn';

        deleteButton.textContent = 'Delete';

        deleteButton.addEventListener('click', function () {
            deleteTask(task.id);
        });

        taskActions.appendChild(editButton);
        taskActions.appendChild(deleteButton);

        taskItem.appendChild(taskText);
        taskItem.appendChild(priorityBadge);
        taskItem.appendChild(taskActions);

        taskList.appendChild(taskItem);
    }

    // -----------------------------
    // Edit Task
    // -----------------------------
    async function editTask(taskId) {

        var taskItem =
            taskList.querySelector('[data-id="' + taskId + '"]');

        if (!taskItem) {
            return;
        }

        var taskText =
            taskItem.querySelector('.task-text');

        var newText =
            prompt('Edit task title:', taskText.textContent);

        if (!newText || !newText.trim()) {
            return;
        }

        try {

            var response = await fetch('/tasks/' + taskId, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: newText.trim()
                })
            });

            var data = await response.json();

            if (!response.ok) {
                throw new Error(formatError(data));
            }

            taskText.textContent = data.title;

        } catch (error) {

            console.error('Error updating task:', error);

            alert(error.message || 'Failed to update task');
        }
    }

    // -----------------------------
    // Delete Task
    // -----------------------------
    async function deleteTask(taskId) {

        if (!confirm('Are you sure you want to delete this task?')) {
            return;
        }

        try {

            var response =
                await fetch('/tasks/' + taskId, {
                    method: 'DELETE'
                });

            var data = await response.json();

            if (!response.ok) {
                throw new Error(formatError(data));
            }

            var taskItem =
                taskList.querySelector(
                    '[data-id="' + taskId + '"]'
                );

            if (taskItem) {
                taskItem.remove();
            }

        } catch (error) {

            console.error('Error deleting task:', error);

            alert(error.message || 'Failed to delete task');
        }
    }

    // -----------------------------
    // Format Backend Error
    // -----------------------------
    function formatError(errorData) {

        if (!errorData) {
            return 'Unknown server error';
        }

        if (typeof errorData.detail === 'string') {
            return errorData.detail;
        }

        if (Array.isArray(errorData.detail)) {

            return errorData.detail
                .map(function (error) {

                    if (typeof error === 'string') {
                        return error;
                    }

                    return error.msg || 'Validation error';

                })
                .join('\n');
        }

        return JSON.stringify(errorData);
    }

    // -----------------------------
    // Generic Error
    // -----------------------------
    function showError(error) {

        console.error(error);

        alert(
            error.message ||
            'Something went wrong while starting TaskFlow.'
        );
    }

});