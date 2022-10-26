import "./style.css";
import { appendDeleteTaskModal, appendMoveTaskModal, appendNewProjectModal, appendNewTaskModal, appendNewTaskModalFromProject, appendUpdateTaskModal, appendViewTaskModal } from "./modals";
import { getProjectNames, getProjectTasks } from "./projects";

export default function buildUserInterface(){
    const container = document.querySelector("#content");

    _appendNavBar(container);

    const mainWrapper = document.createElement("section");
    mainWrapper.classList.add("wrapper");

    _appendAside(mainWrapper);
    _appendMainSection(mainWrapper);

    container.appendChild(mainWrapper);
}


function _appendNavBar(container){
    const navBar = document.createElement("nav");

    const hamburgerToggle = document.createElement("i");
    hamburgerToggle.classList.add("fa-solid", "fa-bars");
    hamburgerToggle.id = "hamburger-toggle";
    hamburgerToggle.addEventListener("click", _toggleSideMenu);
    navBar.appendChild(hamburgerToggle);

    const newTaskButton = document.createElement("i");
    newTaskButton.classList.add("fa-solid", "fa-plus");
    newTaskButton.id = "new-task-button";
    newTaskButton.addEventListener("click", appendNewTaskModal);
    navBar.appendChild(newTaskButton);

    container.appendChild(navBar);
}


function _toggleSideMenu(){
    const sideMenu = document.querySelector("aside");
    sideMenu.classList.toggle("active");
}


function _appendAside(container){
    const aside = document.createElement("aside");
    aside.classList.add("active");

    const inbox = document.createElement("section");
    inbox.classList.add("inbox");
    const inboxTitle = document.createElement("span");
    inboxTitle.innerText = "Inbox";
    inbox.appendChild(inboxTitle);
    inbox.addEventListener("click", ()=>{_displayTasks("Inbox")});
    aside.appendChild(inbox);

    _appendProjects(aside);

    container.appendChild(aside);
}
// Inbox loads as the default project.
window.addEventListener("load", ()=>{_displayTasks("Inbox")});

function _appendProjects(container){
    const projectList = document.createElement("section");
    projectList.classList.add("project-list");

    const projectsToggle = document.createElement("section");
    projectsToggle.id = "project-toggle";
    projectsToggle.innerText = "Projects";
    const toggleIcon = document.createElement("i");
    toggleIcon.classList.add("fa-solid", "fa-chevron-down");
    projectsToggle.appendChild(toggleIcon);
    projectsToggle.addEventListener("click", _toggleProjects);
    projectList.appendChild(projectsToggle);
    container.appendChild(projectList);

    const projects = document.createElement("section");
    projects.classList.add("projects", "hidden");
    projectList.appendChild(projects);

    for(const projectName of getProjectNames()){
        const PROJECTS_TO_IGNORE = ["Inbox"];
        if(PROJECTS_TO_IGNORE.includes(projectName)) continue;

        const project = document.createElement("section");
        project.innerText = projectName;
        project.addEventListener("click", ()=>{_displayTasks(projectName)});
        projects.appendChild(project);
    }

    const newProjectButton = document.createElement("section");
    newProjectButton.classList.add("new-project-button");
    newProjectButton.addEventListener("click", appendNewProjectModal);
    const icon = document.createElement("i");
    icon.classList.add("fa-solid", "fa-plus");
    newProjectButton.appendChild(icon);
    const title = document.createElement("p");
    title.innerText = "New Project";
    newProjectButton.appendChild(title);
    projects.appendChild(newProjectButton);
}

function _toggleProjects(){
    const toggleIcon = document.querySelector("#project-toggle > .fa-solid");
    toggleIcon.classList.toggle("fa-chevron-down");
    toggleIcon.classList.toggle("fa-chevron-up");
    
    const projects = document.querySelector("aside .projects");
    projects.classList.toggle("hidden");
}

function _appendMainSection(container){
    const main = document.createElement("main");
    container.appendChild(main);
}

function _displayTasks(project){
    const formattedProjectName = `${project.replaceAll(" ", "-")}-page`;

    const tasksAlreadyOnScreen = document.querySelector(`.${formattedProjectName}`);
    if(tasksAlreadyOnScreen) return;

    const projectPage = document.createElement("section");
    projectPage.classList.add(formattedProjectName, "project");

    const projectPageHeader = document.createElement("header");
    projectPage.appendChild(projectPageHeader);
    
    const projectPageTitle = document.createElement("h2");
    projectPageTitle.classList.add("title");
    projectPageTitle.innerText = project;
    projectPageHeader.appendChild(projectPageTitle);

    const projectPageTasks = document.createElement("section");
    projectPageTasks.classList.add("project-tasks");

    const tasks = getProjectTasks(project);
    for (const taskKey in tasks){
        const task = tasks[taskKey];
        //This is used to link the details of a task with the task.
        const hashedTitle = _hash(task.title);

        const todo = document.createElement("section");
        todo.classList.add("task");
        todo.setAttribute("data-id", hashedTitle);
        todo.addEventListener("click", (e)=>{_toggleDetails(e)});

        const statusCheckbox = document.createElement("input");
        statusCheckbox.classList.add("status-checkbox");
        statusCheckbox.type = "checkbox";
        statusCheckbox.title = "Toggle Status";
        const taskCompleted = task.status;
        if(taskCompleted){
            todo.classList.add("done");
            statusCheckbox.checked = true;
        }
        statusCheckbox.addEventListener("change", ()=>{_toggleTaskStatus(task, todo)});
        todo.appendChild(statusCheckbox);

        const taskName = document.createElement("span");
        taskName.classList = "task-name";
        taskName.innerText = task.title;
        todo.appendChild(taskName);

        const viewButton = document.createElement("i");
        viewButton.id = "view-button";
        viewButton.classList.add("fa-solid", "fa-eye");
        viewButton.title = "View";
        viewButton.addEventListener("click", ()=>{appendViewTaskModal(task)});
        todo.appendChild(viewButton);

        const priorityToggle = document.createElement("i");
        priorityToggle.id = "priority-toggle";
        priorityToggle.classList.add("fa-solid", "fa-flag", task.priority);
        priorityToggle.title = "Toggle Priority";
        priorityToggle.addEventListener("click", ()=>{_toggleTaskPriority(task)});
        todo.appendChild(priorityToggle);

        const editButton = document.createElement("i");
        editButton.id = "edit-button";
        editButton.classList.add("fa-solid", "fa-pen-to-square");
        editButton.title = "Update";
        editButton.addEventListener("click", ()=>{appendUpdateTaskModal(task)});
        todo.appendChild(editButton);

        const moveTaskButton = document.createElement("i");
        moveTaskButton.id = "move-task-button";
        moveTaskButton.classList.add("fa-regular", "fa-share-from-square");
        moveTaskButton.title = "Move";
        moveTaskButton.addEventListener("click", ()=>{appendMoveTaskModal(task)});
        todo.appendChild(moveTaskButton);

        const deleteTaskButton = document.createElement("i");
        deleteTaskButton.id = "delete-task-button";
        deleteTaskButton.classList.add("fa-solid", "fa-trash-can");
        deleteTaskButton.title = "Delete";
        deleteTaskButton.addEventListener("click", ()=>{appendDeleteTaskModal(task)});
        todo.appendChild(deleteTaskButton);

        projectPageTasks.appendChild(todo);

        const details = document.createElement("section");
        details.classList.add("task-details", "collapsed");
        details.setAttribute("data-id", hashedTitle);

        const detailsDescription = document.createElement("p");
        detailsDescription.innerHTML = `<span>Description:</span> ${task.description}`;
        details.appendChild(detailsDescription);

        const detailsPriority = document.createElement("p");
        detailsPriority.innerHTML = `<span>Priority:</span> ${task.priority}`;
        details.appendChild(detailsPriority);

        const detailsStatus = document.createElement("p");
        detailsStatus.innerHTML = `<span>Status:</span> ${(task.status) ? "Done" : "Pending"}`;
        details.appendChild(detailsStatus);

        const detailsProject = document.createElement("p");
        detailsProject.innerHTML = `<span>Project:</span> ${task.project}`;
        details.appendChild(detailsProject);

        projectPageTasks.appendChild(details);
    }
    projectPage.appendChild(projectPageTasks);

    const addTaskButton = document.createElement("section");
    addTaskButton.id = "add-task-button";
    addTaskButton.addEventListener("click", ()=>{appendNewTaskModalFromProject(project)});
    const icon = document.createElement("i");
    icon.classList.add("fa-solid", "fa-plus");
    addTaskButton.appendChild(icon);
    const text = document.createElement("section");
    text.innerText = "Add Task";
    addTaskButton.appendChild(text);
    projectPage.appendChild(addTaskButton);

    const main = document.querySelector("main");
    _clearPreviousPage(main);
    main.appendChild(projectPage);
}

function _toggleTaskStatus(task, todo){
    const currentStatus = task.status;
    const newStatus = !currentStatus;
    task.update("status", newStatus);
    todo.classList.toggle("done");
    reloadTasks(task.project);
}

function _toggleTaskPriority(task){
    const currentPriority = task.priority;
    const newPriority = (currentPriority === "low") ? "medium" : (currentPriority === "medium") ? "high" : "low";
    task.update("priority", newPriority);
    reloadTasks(task.project);
}

export function reloadTasks(project){
    document.querySelector("section.project").remove();
    _displayTasks(project);
}

export function reloadProjects(){
    document.querySelector(".project-list").remove();
    
    const aside = document.querySelector("aside");
    _appendProjects(aside);
    _toggleProjects();
}

function _clearPreviousPage(container){
    container.innerHTML = "";
}

function _toggleDetails(event){
    if(!event.target.getAttribute("class").includes("task")){
        return;
    }

    const dataId = event.target.getAttribute("data-id");
    const details = document.querySelector(`section.task-details[data-id='${dataId}']`);
    details.classList.toggle("collapsed");
}

function _hash(string){
    let totalValue = 0;
    for (const character of string){
        totalValue += character.charCodeAt(0);
    }
    return totalValue;
}