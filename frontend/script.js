document.addEventListener('DOMContentLoaded', function () {

    // =========================================================
    // DOM ELEMENTS
    // =========================================================

    var taskForm = document.getElementById('taskForm');
    var taskList = document.getElementById('taskList');
    var titleError = document.getElementById('titleError');

    var projectSelect = document.getElementById('project_id');

    var quickAddBtn = document.getElementById('quickAddBtn');
    var quickAddInput = document.getElementById('quickAddInput');
    var quickAddMessage = document.getElementById('quickAddMessage');

    var searchInput = document.getElementById('searchInput');

    var projectId = null;

    var allTasks = [];



    // =========================================================
    // START APPLICATION
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


        try {

            // -------------------------------------------------
            // GET PROJECTS
            // -------------------------------------------------

            var response =
                await fetch('/projects');


            if (!response.ok) {

                var projectLoadError =
                    await response.json();

                throw new Error(
                    formatError(projectLoadError)
                );
            }


            var projects =
                await response.json();


            console.log(
                'Projects received:',
                projects
            );


            // =================================================
            // PROJECTS EXIST
            // =================================================

            if (
                Array.isArray(projects) &&
                projects.length > 0
            ) {

                fillProjectDropdown(projects);


                projectId =
                    Number(projects[0].id);


                projectSelect.value =
                    String(projectId);


                console.log(
                    'Selected Project ID:',
                    projectId
                );


                return;
            }



            // =================================================
            // NO PROJECTS
            // =================================================

            console.log(
                'No projects found. Trying to create default project...'
            );


            await createDefaultProject();


        } catch (error) {

            console.error(
                'Load projects error:',
                error
            );


            projectSelect.innerHTML = '';


            var errorOption =
                document.createElement('option');


            errorOption.value = '';


            errorOption.textContent =
                'Unable to load projects';


            projectSelect.appendChild(
                errorOption
            );


            projectId = null;


            showError(error);
        }
    }



    // =========================================================
    // CREATE DEFAULT PROJECT
    // =========================================================

    async function createDefaultProject() {

        try {

            // -------------------------------------------------
            // CREATE DEFAULT USER
            // -------------------------------------------------

            var userResponse =
                await fetch(
                    '/users',
                    {
                        method: 'POST',

                        headers: {
                            'Content-Type':
                                'application/json'
                        },

                        body: JSON.stringify({

                            email:
                                'demo@taskflow.com',

                            name:
                                'TaskFlow User'
                        })
                    }
                );


            var user;


            // -------------------------------------------------
            // USER CREATED
            // -------------------------------------------------

            if (userResponse.ok) {

                user =
                    await userResponse.json();


                console.log(
                    'Default user created:',
                    user
                );

            }

            // -------------------------------------------------
            // USER ALREADY EXISTS
            // -------------------------------------------------

            else {

                console.log(
                    'User already exists or POST failed. Loading users...'
                );


                var usersResponse =
                    await fetch('/users');


                if (!usersResponse.ok) {

                    var usersError =
                        await usersResponse.json();


                    throw new Error(
                        formatError(usersError)
                    );
                }


                var users =
                    await usersResponse.json();


                console.log(
                    'Users received:',
                    users
                );


                if (
                    !Array.isArray(users) ||
                    users.length === 0
                ) {

                    throw new Error(
                        'No users available. Please create a user first.'
                    );
                }


                user =
                    users[0];
            }



            // =================================================
            // CREATE DEFAULT PROJECT
            // =================================================

            var projectResponse =
                await fetch(
                    '/projects',
                    {
                        method: 'POST',

                        headers: {
                            'Content-Type':
                                'application/json'
                        },

                        body: JSON.stringify({

                            name:
                                'My TaskFlow Project',

                            owner_id:
                                user.id
                        })
                    }
                );


            if (!projectResponse.ok) {

                var createProjectError =
                    await projectResponse.json();


                throw new Error(
                    formatError(createProjectError)
                );
            }


            var newProject =
                await projectResponse.json();


            console.log(
                'Default project created:',
                newProject
            );


            // -------------------------------------------------
            // PUT NEW PROJECT IN DROPDOWN
            // -------------------------------------------------

            fillProjectDropdown([
                newProject
            ]);


            projectId =
                Number(newProject.id);


            projectSelect.value =
                String(projectId);


            console.log(
                'New Project ID:',
                projectId
            );

        } catch (error) {

            console.error(
                'Create default project error:',
                error
            );


            projectSelect.innerHTML = '';


            var errorOption =
                document.createElement('option');


            errorOption.value = '';


            errorOption.textContent =
                'No projects available';


            projectSelect.appendChild(
                errorOption
            );


            projectId = null;


            throw error;
        }
    }



    // =========================================================
    // FILL PROJECT DROPDOWN
    // =========================================================

    function fillProjectDropdown(projects) {

        if (!projectSelect) {

            return;
        }


        projectSelect.innerHTML = '';


        projects.forEach(
            function (project) {

                var option =
                    document.createElement('option');


                option.value =
                    project.id;


                option.textContent =
                    project.name +
                    ' (ID: ' +
                    project.id +
                    ')';


                projectSelect.appendChild(
                    option
                );

            }
        );
    }



    // =========================================================
    // PROJECT CHANGE
    // =========================================================

    if (projectSelect) {

        projectSelect.addEventListener(
            'change',
            async function () {

                if (!this.value) {

                    projectId = null;

                    if (taskList) {
                        taskList.innerHTML = '';
                    }

                    updateTaskCount();

                    updateDashboardStats([]);

                    updateStatistics([]);

                    return;
                }


                projectId =
                    Number(this.value);


                console.log(
                    'Project changed to:',
                    projectId
                );


                await fetchTasks();

            }
        );
    }



    // =========================================================
    // AI QUICK ADD
    // =========================================================

    if (quickAddBtn) {

        quickAddBtn.addEventListener(
            'click',
            async function () {

                var description =
                    quickAddInput ?
                    quickAddInput.value.trim() :
                    '';


                if (!description) {

                    if (quickAddMessage) {

                        quickAddMessage.textContent =
                            'Please describe your task first.';
                    }

                    return;
                }


                if (!projectId) {

                    if (quickAddMessage) {

                        quickAddMessage.textContent =
                            'Please select a project first.';
                    }

                    return;
                }


                quickAddBtn.disabled =
                    true;


                quickAddBtn.textContent =
                    'Creating...';


                if (quickAddMessage) {

                    quickAddMessage.textContent =
                        '';
                }


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


                    if (quickAddInput) {

                        quickAddInput.value =
                            '';
                    }


                    if (quickAddMessage) {

                        quickAddMessage.textContent =
                            '✅ Task added successfully!';
                    }

                } catch (error) {

                    console.error(
                        'Quick Add Error:',
                        error
                    );


                    if (quickAddMessage) {

                        quickAddMessage.textContent =
                            '❌ ' +
                            (
                                error.message ||
                                'Failed to create task'
                            );
                    }

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
                    document.getElementById('title');


                var descriptionInput =
                    document.getElementById('description');


                var priorityInput =
                    document.getElementById('priority');


                var dueDateInput =
                    document.getElementById('due_date');


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
                // TITLE VALIDATION
                // -------------------------------------------------

                if (!title) {

                    if (titleError) {

                        titleError.textContent =
                            'Title is required';
                    }

                    return;
                }


                // -------------------------------------------------
                // PROJECT VALIDATION
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
                                        Number(projectId)
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


                    console.log(
                        'Task created:',
                        data
                    );


                    await fetchTasks();


                    // -------------------------------------------------
                    // CLEAR FORM
                    // -------------------------------------------------

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

        if (!projectId) {

            return;
        }


        try {

            var response =
                await fetch('/tasks');


            if (!response.ok) {

                var taskError =
                    await response.json();

                throw new Error(
                    formatError(taskError)
                );
            }


            var tasks =
                await response.json();


            if (!Array.isArray(tasks)) {

                tasks = [];
            }


            allTasks =
                tasks;


            // -------------------------------------------------
            // FILTER SELECTED PROJECT
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


            console.log(
                'Tasks for project ' +
                projectId +
                ':',
                projectTasks
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


            if (taskList) {

                taskList.innerHTML =
                    '<tr>' +
                    '<td colspan="6">' +
                    'Unable to load tasks' +
                    '</td>' +
                    '</tr>';
            }
        }
    }



    // =========================================================
    // RENDER TASKS
    // =========================================================

    function renderTasks(tasks) {

        if (!taskList) {

            return;
        }


        taskList.innerHTML =
            '';


        if (
            !tasks ||
            tasks.length === 0
        ) {

            return;
        }


        tasks.forEach(
            function (task) {

                renderTask(task);

            }
        );
    }



    // =========================================================
    // RENDER SINGLE TASK
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
            task.title || '';



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
        // EDIT BUTTON
        // -----------------------------------------------------

        var editButton =
            document.createElement('button');


        editButton.className =
            'edit-btn';


        editButton.type =
            'button';


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
        // DELETE BUTTON
        // -----------------------------------------------------

        var deleteButton =
            document.createElement('button');


        deleteButton.className =
            'delete-btn';


        deleteButton.type =
            'button';


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
                                ) === Number(
                                    projectId
                                );


                            var title =
                                task.title ||
                                '';


                            var matchesSearch =
                                title
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


        var high =
            0;


        var medium =
            0;


        var low =
            0;


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

        if (!taskList) {

            return;
        }


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


        try {

            return JSON.stringify(
                errorData
            );

        } catch (error) {

            return 'Server error';
        }
    }



    // =========================================================
    // GENERIC ERROR
    // =========================================================

    function showError(error) {

        console.error(
            'TaskFlow Error:',
            error
        );


        // Don't show alert for normal empty-project
        // handling if the dropdown already has a message.

        if (
            projectSelect &&
            projectId === null &&
            projectSelect.options.length > 0
        ) {

            return;
        }


        alert(
            error.message ||
            'Something went wrong while starting TaskFlow.'
        );
    }

});