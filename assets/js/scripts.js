$(document).ready(function () {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function renderTasks() {
        $('.tasks').empty();
        tasks.forEach(task => {
            const taskElement = $(`<div class="task" draggable="true">
                <h5>${task.title}</h5>
                <p>${task.description}</p>
                <small>Deadline: ${task.deadline}</small>
                <button class="btn btn-danger btn-sm delete-task">Delete</button>
            </div>`);
            const deadline = dayjs(task.deadline);
            const now = dayjs();
            if (deadline.isBefore(now, 'day')) {
                taskElement.addClass('overdue');
            } else if (deadline.isBefore(now.add(3, 'day'), 'day')) {
                taskElement.addClass('nearing-deadline');
            }
            taskElement.find('.delete-task').click(() => {
                tasks.splice(tasks.indexOf(task), 1);
                saveTasks();
                renderTasks();
            });
            $(`#${task.status} .tasks`).append(taskElement);
        });
    }

    $('#addTaskBtn').click(() => {
        $('#taskModal').modal('show');
    });

    $('#taskForm').submit(function (event) {
        event.preventDefault();
        const newTask = {
            title: $('#taskTitle').val(),
            description: $('#taskDescription').val(),
            deadline: $('#taskDeadline').val(),
            status: 'not-started'
        };
        tasks.push(newTask);
        saveTasks();
        renderTasks();
        $('#taskModal').modal('hide');
    });

    $('.task-column').on('dragover', function (event) {
        event.preventDefault();
        $(this).addClass('drag-over');
    }).on('dragleave', function () {
        $(this).removeClass('drag-over');
    }).on('drop', function (event) {
        event.preventDefault();
        $(this).removeClass('drag-over');
        const taskId = event.originalEvent.dataTransfer.getData('text');
        const task = tasks.find(t => t.title === taskId);
        task.status = this.id;
        saveTasks();
        renderTasks();
    });

    $(document).on('dragstart', '.task', function (event) {
        event.originalEvent.dataTransfer.setData('text', $(this).find('h5').text());
    });

    renderTasks();
});
