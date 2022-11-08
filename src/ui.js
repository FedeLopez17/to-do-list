import "./style.css";
import { appendDeleteProjectModal, appendDeleteTaskModal, appendMoveTaskModal, appendNewProjectModal, appendNewTaskModal, appendNewTaskModalFromProject, appendUpdateProjectModal, appendUpdateTaskModal, appendViewTaskModal } from "./modals";
import { getProjectNames, getProjectTasks, getTodaysTasks, getThisWeeksTasks, getProjectIcon } from "./projects";

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

    const ASIDE_COMPONENTS = {
        inbox: {
            title: "Inbox",
            classes: ["inbox", "project"],
            iconClasses: ["fa-solid", getProjectIcon("Inbox").class],
            eventListeners: [
                {event: "click", function: () => {_toggleCurrentProject(".inbox.project")}},
                {event: "click", function: () => {_displayTasks("Inbox")}}
            ]
        },
        today: {
            title: "Today",
            classes: ["today", "project"],
            iconClasses: ["fa-solid", "fa-calendar-day"],
            eventListeners: [
                {event: "click", function: () => {_toggleCurrentProject(".today.project")}},
                {event: "click", function: () => {_displayTasks("Today")}}
            ]
        },
        thisWeek: {
            title: "This week",
            classes: ["this-week", "project"],
            iconClasses: ["fa-solid", "fa-calendar-week"],
            eventListeners: [
                {event: "click", function: () => {_toggleCurrentProject(".this-week.project")}},
                {event: "click", function: () => {_displayTasks("This week")}}
            ]
        },
    }   
    
    for (let component in ASIDE_COMPONENTS){
        component = ASIDE_COMPONENTS[component];
        const componentSection = document.createElement("section");
        componentSection.classList.add(...component.classes);
        const componentIcon = document.createElement("i");
        componentIcon.classList.add(...component.iconClasses);
        componentSection.appendChild(componentIcon);
        const componentTitle = document.createElement("span");
        componentTitle.innerText = component.title;
        componentSection.append(componentTitle);
        component.eventListeners.forEach(eventListener => {componentSection.addEventListener(eventListener.event, eventListener.function)});
        aside.appendChild(componentSection);
    }

    _appendProjects(aside);
    container.appendChild(aside);
}
// Inbox loads as the default project.
window.addEventListener("load", ()=>{_displayTasks("Inbox")});


function _toggleCurrentProject(projectClass){
    const currentProject = document.querySelector(".project.current");
    const project = document.querySelector(projectClass);
    const projectIsCurrent = (project === currentProject);
    if (projectIsCurrent) return;
    const oldProjectSetAsCurrent = currentProject;
    if(oldProjectSetAsCurrent) oldProjectSetAsCurrent.classList.toggle("current");
    project.classList.toggle("current");
}


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

        const projectContainer = document.createElement("section");
        projectContainer.classList.add("project-container");
        projects.appendChild(projectContainer);

        const project = document.createElement("section");
        project.classList.add("project");
        project.addEventListener("click", ()=>{_toggleCurrentProject(project)});
        project.addEventListener("click", ()=>{_displayTasks(projectName)});

        const projectIcon = document.createElement("i");
        projectIcon.classList.add("fa-solid", getProjectIcon(projectName).class);
        project.appendChild(projectIcon);

        const projectTitle = document.createElement("span");
        projectTitle.innerText = projectName;
        project.appendChild(projectTitle);

        projectContainer.appendChild(project);

        const PROJECT_BUTTONS = {
            edit: {
                htmlElement: "i",
                id: "edit-project-button",
                classes: ["fa-solid", "fa-pen-to-square"],
                title: "Edit",
                eventListeners: [{event: "click", function: ()=>{appendUpdateProjectModal(projectName)}}]
            },
            delete: {
                htmlElement: "i",
                id: "delete-project-button",
                classes: ["fa-solid", "fa-trash-can"],
                title: "Delete",
                eventListeners: [{event: "click", function: ()=>{appendDeleteProjectModal(projectName)}}]
            }
        }

        _appendButtons(PROJECT_BUTTONS, projectContainer);
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

    const isTodaysTasks = (project == "Today");
    const isThisWeeksTasks = (project == "This week");

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
    
    const tasks = (isTodaysTasks) ? getTodaysTasks() : (isThisWeeksTasks) ? getThisWeeksTasks() : getProjectTasks(project);
    for (const taskName in tasks){
        const task = tasks[taskName];
        //This is used to link the details of a task with the task.
        const hashedTitle = _hash(task.title);

        const taskSection = document.createElement("section");
        taskSection.classList.add("task");
        taskSection.setAttribute("data-id", hashedTitle);
        taskSection.addEventListener("click", (event)=>{_toggleDetails({mode: "event", event})});

        const statusCheckbox = document.createElement("input");
        statusCheckbox.classList.add("status-checkbox");
        statusCheckbox.type = "checkbox";
        statusCheckbox.title = "Toggle Status";
        const taskCompleted = task.status;
        if(taskCompleted){
            taskSection.classList.add("done");
            statusCheckbox.checked = true;
        }
        statusCheckbox.addEventListener("change", ()=>{_toggleTaskStatus(task, taskSection)});
        taskSection.appendChild(statusCheckbox);

        const taskTitle = document.createElement("span");
        taskTitle.classList.add("task-title");
        taskTitle.innerText = task.title;
        taskTitle.style.pointerEvents = "none";
        taskSection.appendChild(taskTitle);

        const TASK_BUTTONS = {
            view: {
                htmlElement: "i",
                id: "view-button",
                classes: ["fa-solid", "fa-circle-info"],
                title: "View",
                eventListeners: [{event: "click", function: ()=>{appendViewTaskModal(task)}}],
            },
            priority: {
                id: "priority-toggle",
                classes: ["fa-solid", "fa-flag", task.priority],
                title: "Toggle Priority",
                eventListeners: [{event: "click", function: ()=>{_toggleTaskPriority(task)}}],
            },
            edit: {
                htmlElement: "i",
                id: "edit-button",
                classes: ["fa-solid", "fa-pen-to-square"],
                title: "Update",
                eventListeners: [{event: "click", function: ()=>{appendUpdateTaskModal(task)}}],
            },
            move: {
                htmlElement: "i",
                id: "move-task-button",
                classes: ["fa-solid", "fa-share-from-square"],
                title: "Move",
                eventListeners: [{event: "click", function: ()=>{appendMoveTaskModal(task)}}],
            },
            delete: {
                htmlElement: "i",
                id: "delete-task-button",
                classes: ["fa-solid", "fa-trash-can"],
                title: "Delete",
                eventListeners: [{event: "click", function: ()=>{appendDeleteTaskModal(task)}}],
            }
        }
        _appendButtons(TASK_BUTTONS, taskSection);
        projectPageTasks.appendChild(taskSection);

        const details = document.createElement("section");
        details.classList.add("task-details", "collapsed");
        details.setAttribute("data-id", hashedTitle);

        const TASK_DETAILS = {
            description: {
                htmlElement: "p",
                innerHTML: `<span>Description:</span> ${task.description}`
            },
            priority: {
                htmlElement: "p",
                innerHTML: `<span>Priority:</span> ${task.priority}`
            },
            status: {
                htmlElement: "p",
                innerHTML: `<span>Status:</span> ${(task.status) ? "Done" : "Pending"}`
            },
            dueDate: {
                htmlElement: "p",
                innerHTML: `<span>Due date:</span> ${task.formattedDate}`
            },
            project: {
                htmlElement: "p",
                innerHTML: `<span>Project:</span> ${task.project}`
            },
        }

        for(const detailName in TASK_DETAILS){
            const detailObject = TASK_DETAILS[detailName];
            const detail = document.createElement(detailObject.htmlElement);
            detail.innerHTML = detailObject.innerHTML;
            details.appendChild(detail);
        }
        projectPageTasks.appendChild(details);
    }
    projectPage.appendChild(projectPageTasks);

    const main = document.querySelector("main");
    _clearPreviousPage(main);
    main.appendChild(projectPage);

    // Today and This week don't allow users to add tasks, they just show any task that has its due date set to today or any day of this week
    if(isTodaysTasks || isThisWeeksTasks) return;

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
}


function _toggleTaskStatus(task, todo){
    const currentStatus = task.status;
    const newStatus = !currentStatus;
    task.update("status", newStatus);
    todo.classList.toggle("done");
    const detailsWereOpen = document.querySelector(".task-details:not(.collapsed)");
    reloadTasks(task.project);
    if(detailsWereOpen){
        const hashedTitle = _hash(task.title);
        _toggleDetails({mode: "hash", hashedTitle});
    };
}


function _toggleTaskPriority(task){
    const currentPriority = task.priority;
    const newPriority = (currentPriority === "low") ? "medium" : (currentPriority === "medium") ? "high" : "low";
    task.update("priority", newPriority);
    reloadTasks(task.project);
}


function _appendButtons(BUTTONS_INFO, container){
    for(const buttonName in BUTTONS_INFO){
        const buttonObject = BUTTONS_INFO[buttonName];
        const projectButton = document.createElement(buttonObject.htmlElement);
        projectButton.id = buttonObject.id;
        buttonObject.classes.forEach(cssClass => {projectButton.classList.add(cssClass)});
        projectButton.title = buttonObject.title;
        buttonObject.eventListeners.forEach(eventListener => {projectButton.addEventListener(eventListener.event, eventListener.function)});
        container.appendChild(projectButton);
    }
}


export function reloadTasks(project){
    const isToday = document.querySelector(".Today-page.project");
    const isThisWeek = document.querySelector(".This-week-page.project");
    const projectToReload = (isToday) ? "Today" : (isThisWeek) ? "This week" : project;
    document.querySelector("main section.project").remove();
    _displayTasks(projectToReload);
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


function _toggleDetails({mode, event, hashedTitle}){
    const isEventMode = (mode === "event");

    let dataId;

    if(isEventMode){
        const clickedOnAButton = !event.target.getAttribute("class").includes("task");
        if(clickedOnAButton) return;
        dataId = event.target.getAttribute("data-id");
    }
    else{
        dataId = hashedTitle;
    }

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