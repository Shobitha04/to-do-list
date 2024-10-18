window.onload = function() {
    loadTasks();
};

function addTask() {
    const taskText = document.getElementById("new-task").value;
    if (taskText) {
        const task = { text: taskText, status: "todo" };
        saveTask(task);
        document.getElementById("new-task").value = ""; 
        displayTasks();
    }
}

// Load tasks from local storage
function loadTasks() {
    const todoTasks = JSON.parse(localStorage.getItem("todoTasks")) || [];
    const inProcessTasks = JSON.parse(localStorage.getItem("inProcessTasks")) || [];
    const completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || [];

    displayList("todo-list", todoTasks);
    displayList("in-process-list", inProcessTasks);
    displayList("completed-list", completedTasks);
}

// Save task based on the status pf task
function saveTask(task) {
    const status = task.status;
    let tasks = JSON.parse(localStorage.getItem(`${status}Tasks`)) || [];
    tasks.push(task);
    localStorage.setItem(`${status}Tasks`, JSON.stringify(tasks));
}


function displayTasks() {
    document.getElementById("todo-list").innerHTML = "";
    document.getElementById("in-process-list").innerHTML = "";
    document.getElementById("completed-list").innerHTML = "";

    loadTasks();
}

function displayList(elementId, tasks) {
    const list = document.getElementById(elementId);
    tasks.forEach((task, index) => {
        const listItem = document.createElement("li");
        const taskText = document.createElement("span");
        taskText.innerText = task.text;
        listItem.appendChild(taskText);
        
        
        if (elementId === "todo-list") {
            const moveToProcessBtn = createButton("Move to In Process", () => moveTask(task, "inProcess"));
            listItem.appendChild(moveToProcessBtn);
        } else if (elementId === "in-process-list") {
            const moveToCompletedBtn = createButton("Move to Completed", () => moveTask(task, "completed"));
            listItem.appendChild(moveToCompletedBtn);
        }
        list.appendChild(listItem);
    });
}

// button with a click event
function createButton(text, onClick) {
    const button = document.createElement("button");
    button.innerText = text;
    button.onclick = onClick;
    return button;
}


function moveTask(task, newStatus) {
    removeTask(task);
    task.status = newStatus;
    saveTask(task);
    displayTasks();
}

// Remove task from the list and local storage
function removeTask(task) {
    const currentStatus = task.status + "Tasks";
    let tasks = JSON.parse(localStorage.getItem(currentStatus)) || [];
    tasks = tasks.filter(t => t.text !== task.text);
    localStorage.setItem(currentStatus, JSON.stringify(tasks));
}

// Clear tasks that are done
function clearCompleted() {
    localStorage.removeItem("completedTasks");
    displayTasks();
}
