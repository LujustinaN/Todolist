document.addEventListener("DOMContentLoaded", function () {
  const inputTask = document.getElementById("inputTask");
  const tasksList = document.getElementById("tasks");
  const formInputTask = document.getElementById("formInputTask");
  const addEditButton = document.getElementById("addEditButton");
  const completedCountElement = document.getElementById("completedCount");
  const themeToggle = document.getElementById("themeToggle"); // Theme toggle checkbox

  let completedCount = 0;
  let editingTask = null;

  // Load tasks from LocalStorage on page load
  loadTasksFromLocalStorage();

  // Submit data for form
  formInputTask.addEventListener("submit", function (event) {
    event.preventDefault();
    if (editingTask) {
      updateTask();
    } else {
      addTask();
    }
    saveTasksToLocalStorage(); // Save tasks to LocalStorage
  });

  // Handle Enter key press
  inputTask.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      if (editingTask) {
        updateTask();
      } else {
        addTask();
      }
    }
  });

  // Update completed task count
  function updateCompletedCount() {
    completedCount = document.querySelectorAll(
      '.job[style="text-decoration: line-through;"]'
    ).length;
    completedCountElement.textContent = completedCount;
  }

  // Load tasks from LocalStorage
  function loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(function (taskText) {
      addTaskToUI(taskText);
    });
  }

  // Save tasks to LocalStorage
  function saveTasksToLocalStorage() {
    const taskTexts = Array.from(tasksList.querySelectorAll(".job")).map(
      function (taskElement) {
        return taskElement.textContent;
      }
    );
    localStorage.setItem("tasks", JSON.stringify(taskTexts));
  }

  // Add task to UI
  function addTaskToUI(taskText) {
    const taskItem = document.createElement("li");
    taskItem.className = "taskItem";
    taskItem.innerHTML = `
                    <span class="job">${taskText}</span>
                    <div class="action">
                        <button class="btEdit"><i class="fa-solid fa-pencil"></i></button>
                        <button class="btDelete"><i class="fa-solid fa-x"></i></button>
                    </div>
                `;
    tasksList.appendChild(taskItem);
    updateCompletedCount();
    const taskTextElement = taskItem.querySelector(".job");
    const editButton = taskItem.querySelector(".btEdit");
    const deleteButton = taskItem.querySelector(".btDelete");

    // Handle edit button click
    editButton.addEventListener("click", function () {
      inputTask.value = taskTextElement.textContent;
      inputTask.focus();
      addEditButton.textContent = editingTask ? "EDIT TASK" : "ADD TASK";
      editingTask = taskTextElement;
    });

    // Handle delete button click
    deleteButton.addEventListener("click", function () {
      const confirmDelete = confirm(
        "Are you sure you want to delete this task?"
      );
      if (confirmDelete) {
        tasksList.removeChild(taskItem);
        updateCompletedCount();
        saveTasksToLocalStorage(); // Save tasks to LocalStorage
      }
    });

    // Handle task completion toggle
    taskTextElement.addEventListener("click", function () {
      if (taskTextElement.style.textDecoration === "line-through") {
        taskTextElement.style.textDecoration = "none";
        completedCount--;
      } else {
        taskTextElement.style.textDecoration = "line-through";
        completedCount++;
      }
      completedCountElement.textContent = completedCount;
      saveTasksToLocalStorage(); // Save tasks to LocalStorage
    });
  }

  // Add a new task to the UI
  function addTask() {
    const taskText = inputTask.value.trim();
    if (taskText !== "") {
      addTaskToUI(taskText);
      inputTask.value = "";
      saveTasksToLocalStorage(); // Save tasks to LocalStorage
    }
  }

  // Update an existing task in the UI
  function updateTask() {
    editingTask.textContent = inputTask.value.trim();
    inputTask.value = "";
    inputTask.blur();
    addEditButton.textContent = "ADD TASK";
    editingTask = null;
    saveTasksToLocalStorage(); // Save tasks to LocalStorage
  }
});
const toggleStyleButton = document.getElementById("toggleStyleButton");
const body = document.body;

toggleStyleButton.addEventListener("click", function () {
  if (body.classList.contains("original-style")) {
    body.classList.remove("original-style");
    body.classList.add("new-style");
  } else {
    body.classList.remove("new-style");
    body.classList.add("original-style");
  }
});
