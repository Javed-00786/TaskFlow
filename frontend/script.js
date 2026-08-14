document.addEventListener('DOMContentLoaded', function () {

    // =========================================================
    // DOM ELEMENTS
    // =========================================================

    var taskForm = document.getElementById('taskForm');
    var taskList = document.getElementById('taskList');
    var titleError = document.getElementById('titleError');

    var projectSelect = document.getElementById('project_id');

    var projectId = null;
    var allTasks = [];


    // =========================================================
    // INITIALIZE APPLICATION
    // =========================================================

    initializeApp();


    async function initializeApp() {

        try {

            await loadProjects();

            if (projectId) {
                await fetchTasks();
            }

        } catch (error) {

            console.error(
                'Initialization error:',
                error
            );

            showError(error);
        }
    }


    // =========================================================
    // LOAD PROJECTS
    // =========================================================

    async function loadProjects() {

        if (!projectSelect) {
            console.error(
                'Project dropdown not found.'
            );
            return;
        }

        projectSelect.innerHTML =
            '<option value="">Loading projects...</option>';

        var response = await fetch('/projects');

        if (!response.ok) {

            throw new Error(
                'Unable to load projects'
            );
        }

        var projects = await response.json();

        projectSelect.innerHTML = '';


        // -----------------------------------------------------
        // No projects
        // -----------------------------------------------------

        if (!projects || projects.length === 0) {

            var emptyOption =
                document.createElement('option');

            emptyOption.value = '';

            emptyOption.textContent =
                'No projects available';

            projectSelect.appendChild(
                emptyOption
            );

            projectId = null;

            return;
        }


        // -----------------------------------------------------
        // Add projects to dropdown
        // -----------------------------------------------------

        projects.forEach(function (project) {

            var option =
                document.createElement('option');

            option.value = project.id;

            option.textContent =
                project.name +
                ' (ID: ' +
                project.id +
                ')';

            projectSelect.appendChild(
                option
            );

        });


        // -----------------------------------------------------
        // Select first project
        // -----------------------------------------------------

        projectId = Number(
            projects[0].id
        );

        projectSelect.value =
            String(projectId);


        console.log(
            'Projects loaded:',
            projects
        );

        console.log(
            'Selected Project ID:',
            projectId
        );
    }


    // =========================================================
    // PROJECT DROPDOWN CHANGE
    // =========================================================

    if (projectSelect) {

        projectSelect.addEventListener(
            'change',
            function () {

                if (!this.value) {

                    projectId = null;

                    return;
                }

                projectId =
                    Number(this.value);


                console.log(
                    'Selected Project ID:',
                    projectId
                );


                // Load tasks for selected project
                fetchTasks();
            }
        );
    }


    // =========================================================
    // AI QUICK ADD
    // =========================================================

    var quickAddBtn =
        document.getElementById(
            'quickAddBtn'
        );

    var quickAddInput =
        document.getElementById(
            'quickAddInput'
        );

    var quickAddMessage =
        document.getElementById(
            'quickAddMessage'
        );


    if (quickAddBtn) {

        quickAddBtn.addEventListener(
            'click',
            async function () {

                var description =
                    quickAddInput.value.trim();


                // Empty input
                if (!description) {

                    quickAddMessage.textContent =
                        'Please describe your task first.';

                    return;
                }


                // Project check
                if (!projectId) {

                    quickAddMessage.textContent =
                        'Please select a project first.';

                    return;
                }


                quickAddBtn.disabled = true;

                quickAddBtn.textContent =
                    'Creating...';

                quickAddMessage.textContent =
                    '';


                try {

                    var response =
                        await fetch(
                            '/tasks/quick-add',
                            {
                                method: 'POST',

                                headers: {
                                    'Content-Type':
                                        'application/json'
                                },

                                body: JSON.stringify({
                                    description:
                                        description,

                                    project_id:
                                        projectId
                                })
                            }
                        );


                    var data =
                        await response.json();


                    if (!response.ok) {

                        throw new Error(
                            formatError(data)
                        );
                    }


                    await fetchTasks();


                    quickAddInput.value =
                        '';


                    quickAddMessage.textContent =
                        '✅ Task added successfully!';


                } catch (error) {

                    console.error(
                        'Quick Add Error:',
                        error
                    );


                    quickAddMessage.textContent =
                        '❌ ' +
                        (
                            error.message ||
                            'Failed to create task'
                        );


                } finally {

                    quickAddBtn.disabled =
                        false;

                    quickAddBtn.textContent =
                        '✨ Quick Add';
                }

            }
        );
    }


    // =========================================================
    // ADD TASK
    // =========================================================

    if (taskForm) {

        taskForm.addEventListener(
            'submit',
            async function (e) {

                e.preventDefault();


                if (titleError) {

                    titleError.textContent =
                        '';
                }


                var titleInput =
                    document.getElementById(
                        'title'
                    );


                var descriptionInput =
                    document.getElementById(
                        'description'
                    );


                var priorityInput =
                    document.getElementById(
                        'priority'
                    );


                var dueDateInput =
                    document.getElementById(
                        'due_date'
                    );


                var title =
                    titleInput ?
                    titleInput.value.trim() :
                    '';


                var description =
                    descriptionInput ?
                    descriptionInput.value.trim() :
                    '';


                var priority =
                    priorityInput ?
                    priorityInput.value :
                    'medium';


                var dueDate =
                    dueDateInput ?
                    dueDateInput.value.trim() :
                    '';


                // -------------------------------------------------
                // Validate title
                // -------------------------------------------------

                if (!title) {

                    if (titleError) {

                        titleError.textContent =
                            'Title is required';
                    }

                    return;
                }


                // -------------------------------------------------
                // Validate project
                // -------------------------------------------------

                if (!projectId) {

                    alert(
                        'Please select a project first.'
                    );

                    return;
                }


                try {

                    var response =
                        await fetch(
                            '/tasks',
                            {
                                method: 'POST',

                                headers: {
                                    'Content-Type':
                                        'application/json'
                                },

                                body: JSON.stringify({

                                    title:
                                        title,

                                    description:
                                        description,

                                    priority:
                                        priority,

                                    due_date:
                                        dueDate ||
                                        null,

                                    status:
                                        'pending',

                                    project_id:
                                        projectId
                                })
                            }
                        );


                    var data =
                        await response.json();


                    if (!response.ok) {

                        throw new Error(
                            formatError(data)
                        );
                    }


                    // Refresh tasks
                    await fetchTasks();


                    // Clear form
                    if (titleInput) {
                        titleInput.value =
                            '';
                    }

                    if (descriptionInput) {
                        descriptionInput.value =
                            '';
                    }

                    if (dueDateInput) {
                        dueDateInput.value =
                            '';
                    }


                } catch (error) {

                    console.error(
                        'Error adding task:',
                        error
                    );


                    alert(
                        error.message ||
                        'Failed to add task'
                    );
                }

            }
        );
    }


    // =========================================================
    // LOAD TASKS
    // =========================================================

    async function fetchTasks() {

        try {

            var response =
                await fetch('/tasks');


            if (!response.ok) {

                throw new Error(
                    'Unable to load tasks'
                );
            }


            var tasks =
                await response.json();


            allTasks = tasks;


            // -------------------------------------------------
            // Filter by selected project
            // -------------------------------------------------

            var projectTasks =
                tasks.filter(
                    function (task) {

                        return Number(
                            task.project_id
                        ) === Number(
                            projectId
                        );
                    }
                );


            renderTasks(
                projectTasks
            );


            updateDashboardStats(
                projectTasks
            );


            updateStatistics(
                projectTasks
            );


            updateTaskCount();


        } catch (error) {

            console.error(
                'Failed to fetch tasks:',
                error
            );
        }
    }


    // =========================================================
    // RENDER ALL TASKS
    // =========================================================

    function renderTasks(tasks) {

        if (!taskList) {
            return;
        }


        taskList.innerHTML =
            '';


        tasks.forEach(
            function (task) {

                renderTask(task);

            }
        );
    }


    // =========================================================
    // RENDER TASK
    // =========================================================

    function renderTask(task) {

        if (!taskList) {
            return;
        }


        var row =
            document.createElement('tr');


        row.dataset.id =
            task.id;


        // -----------------------------------------------------
        // ID
        // -----------------------------------------------------

        var idCell =
            document.createElement('td');

        idCell.textContent =
            task.id;


        // -----------------------------------------------------
        // TITLE
        // -----------------------------------------------------

        var titleCell =
            document.createElement('td');

        titleCell.className =
            'task-text';

        titleCell.textContent =
            task.title;


        // -----------------------------------------------------
        // PRIORITY
        // -----------------------------------------------------

        var priorityCell =
            document.createElement('td');


        var priorityBadge =
            document.createElement('span');


        var priority =
            task.priority ||
            'medium';


        priorityBadge.textContent =
            priority;


        priorityBadge.className =
            'priority-' +
            priority;


        priorityCell.appendChild(
            priorityBadge
        );


        // -----------------------------------------------------
        // DUE DATE
        // -----------------------------------------------------

        var dueDateCell =
            document.createElement('td');


        if (
            task.due_date !== null &&
            task.due_date !== undefined &&
            task.due_date !== ''
        ) {

            dueDateCell.textContent =
                task.due_date;

        } else {

            dueDateCell.textContent =
                '—';
        }


        // -----------------------------------------------------
        // PROJECT
        // -----------------------------------------------------

        var projectCell =
            document.createElement('td');


        projectCell.textContent =
            task.project_id ||
            '—';


        // -----------------------------------------------------
        // ACTION
        // -----------------------------------------------------

        var actionCell =
            document.createElement('td');


        var taskActions =
            document.createElement('div');


        taskActions.className =
            'task-actions';


        // -----------------------------------------------------
        // EDIT
        // -----------------------------------------------------

        var editButton =
            document.createElement('button');


        editButton.className =
            'edit-btn';


        editButton.textContent =
            'Edit';


        editButton.addEventListener(
            'click',
            function () {

                editTask(
                    task.id
                );

            }
        );


        // -----------------------------------------------------
        // DELETE
        // -----------------------------------------------------

        var deleteButton =
            document.createElement('button');


        deleteButton.className =
            'delete-btn';


        deleteButton.textContent =
            'Delete';


        deleteButton.addEventListener(
            'click',
            function () {

                deleteTask(
                    task.id
                );

            }
        );


        taskActions.appendChild(
            editButton
        );


        taskActions.appendChild(
            deleteButton
        );


        actionCell.appendChild(
            taskActions
        );


        // -----------------------------------------------------
        // ADD CELLS
        // -----------------------------------------------------

        row.appendChild(
            idCell
        );


        row.appendChild(
            titleCell
        );


        row.appendChild(
            priorityCell
        );


        row.appendChild(
            dueDateCell
        );


        row.appendChild(
            projectCell
        );


        row.appendChild(
            actionCell
        );


        taskList.appendChild(
            row
        );
    }


    // =========================================================
    // SEARCH TASKS
    // =========================================================

    var searchInput =
        document.getElementById(
            'searchInput'
        );


    if (searchInput) {

        searchInput.addEventListener(
            'input',
            function () {

                var searchText =
                    this.value
                    .trim()
                    .toLowerCase();


                var filteredTasks =
                    allTasks.filter(
                        function (task) {

                            var sameProject =
                                Number(
                                    task.project_id
                                ) ===
                                Number(
                                    projectId
                                );


                            var matchesSearch =
                                task.title
                                .toLowerCase()
                                .includes(
                                    searchText
                                );


                            return (
                                sameProject &&
                                matchesSearch
                            );
                        }
                    );


                renderTasks(
                    filteredTasks
                );


                updateTaskCount();

            }
        );
    }


    // =========================================================
    // UPDATE TASK COUNT
    // =========================================================

    function updateTaskCount() {

        var taskCount =
            document.getElementById(
                'taskCount'
            );


        if (
            taskCount &&
            taskList
        ) {

            var rows =
                taskList.querySelectorAll(
                    'tr'
                );


            taskCount.textContent =
                rows.length +
                (
                    rows.length === 1 ?
                    ' Task' :
                    ' Tasks'
                );
        }
    }


    // =========================================================
    // DASHBOARD STATISTICS
    // =========================================================

    function updateDashboardStats(tasks) {

        var totalTaskCount =
            document.getElementById(
                'totalTaskCount'
            );


        var highTaskCount =
            document.getElementById(
                'highTaskCount'
            );


        var mediumTaskCount =
            document.getElementById(
                'mediumTaskCount'
            );


        var lowTaskCount =
            document.getElementById(
                'lowTaskCount'
            );


        var high = 0;
        var medium = 0;
        var low = 0;


        tasks.forEach(
            function (task) {

                if (
                    task.priority ===
                    'high'
                ) {

                    high++;

                } else if (
                    task.priority ===
                    'medium'
                ) {

                    medium++;

                } else if (
                    task.priority ===
                    'low'
                ) {

                    low++;
                }

            }
        );


        if (totalTaskCount) {

            totalTaskCount.textContent =
                tasks.length;
        }


        if (highTaskCount) {

            highTaskCount.textContent =
                high;
        }


        if (mediumTaskCount) {

            mediumTaskCount.textContent =
                medium;
        }


        if (lowTaskCount) {

            lowTaskCount.textContent =
                low;
        }
    }


    // =========================================================
    // TASK STATISTICS
    // =========================================================

    function updateStatistics(tasks) {

        var completedCount =
            document.getElementById(
                'completedCount'
            );


        var pendingCount =
            document.getElementById(
                'pendingCount'
            );


        var projectCount =
            document.getElementById(
                'projectCount'
            );


        var completed =
            tasks.filter(
                function (task) {

                    return task.status ===
                        'completed';

                }
            ).length;


        var pending =
            tasks.filter(
                function (task) {

                    return task.status ===
                        'pending';

                }
            ).length;


        var projects =
            new Set();


        tasks.forEach(
            function (task) {

                if (task.project_id) {

                    projects.add(
                        task.project_id
                    );
                }

            }
        );


        if (completedCount) {

            completedCount.textContent =
                completed;
        }


        if (pendingCount) {

            pendingCount.textContent =
                pending;
        }


        if (projectCount) {

            projectCount.textContent =
                projects.size;
        }
    }


    // =========================================================
    // EDIT TASK
    // =========================================================

    async function editTask(taskId) {

        var row =
            taskList.querySelector(
                '[data-id="' +
                taskId +
                '"]'
            );


        if (!row) {
            return;
        }


        var titleCell =
            row.querySelector(
                '.task-text'
            );


        if (!titleCell) {
            return;
        }


        var newText =
            prompt(
                'Edit task title:',
                titleCell.textContent
            );


        if (
            !newText ||
            !newText.trim()
        ) {

            return;
        }


        try {

            var response =
                await fetch(
                    '/tasks/' +
                    taskId,
                    {
                        method: 'PUT',

                        headers: {
                            'Content-Type':
                                'application/json'
                        },

                        body: JSON.stringify({

                            title:
                                newText.trim()
                        })
                    }
                );


            var data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    formatError(data)
                );
            }


            await fetchTasks();


        } catch (error) {

            console.error(
                'Error updating task:',
                error
            );


            alert(
                error.message ||
                'Failed to update task'
            );
        }
    }


    // =========================================================
    // DELETE TASK
    // =========================================================

    async function deleteTask(taskId) {

        if (
            !confirm(
                'Are you sure you want to delete this task?'
            )
        ) {

            return;
        }


        try {

            var response =
                await fetch(
                    '/tasks/' +
                    taskId,
                    {
                        method: 'DELETE'
                    }
                );


            var data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    formatError(data)
                );
            }


            await fetchTasks();


        } catch (error) {

            console.error(
                'Error deleting task:',
                error
            );


            alert(
                error.message ||
                'Failed to delete task'
            );
        }
    }


    // =========================================================
    // FORMAT BACKEND ERROR
    // =========================================================

    function formatError(errorData) {

        if (!errorData) {

            return 'Unknown server error';
        }


        if (
            typeof errorData.detail ===
            'string'
        ) {

            return errorData.detail;
        }


        if (
            Array.isArray(
                errorData.detail
            )
        ) {

            return errorData.detail
                .map(
                    function (error) {

                        if (
                            typeof error ===
                            'string'
                        ) {

                            return error;
                        }


                        return (
                            error.msg ||
                            'Validation error'
                        );
                    }
                )
                .join('\n');
        }


        return JSON.stringify(
            errorData
        );
    }


    // =========================================================
    // GENERIC ERROR
    // =========================================================

    function showError(error) {

        console.error(error);


        alert(
            error.message ||
            'Something went wrong while starting TaskFlow.'
        );
    }

});