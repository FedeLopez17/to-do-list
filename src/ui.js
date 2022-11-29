import "./style.css";
import { appendNewProjectModal, appendUpdateProjectModal, appendDeleteProjectModal } from "./modals";
import { appendNewTaskModal, appendNewTaskModalFromProject, appendViewTaskModal, appendUpdateTaskModal, appendMoveTaskModal, appendDeleteTaskModal } from "./modals";
import { getProjectNames, getProjectTasks, getTodaysTasks, getThisWeeksTasks, getProjectIcon, getCompletedTasks } from "./projects";
import displayAlert from "./alerts";
import { PROJECTS_TO_IGNORE } from "./data";

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
    const title = document.createElement("h1");
    const hamburgerToggle = document.createElement("i");
    hamburgerToggle.classList.add("fa-solid", "fa-bars");
    hamburgerToggle.id = "hamburger-toggle";
    hamburgerToggle.addEventListener("click", _toggleSideMenu);
    navBar.appendChild(hamburgerToggle);
    title.id = "page-title";
    title.innerText = "Tick It Up!";
    navBar.appendChild(title);
    const newTaskButton = document.createElement("i");
    newTaskButton.classList.add("fa-solid", "fa-plus");
    newTaskButton.id = "new-task-button";
    newTaskButton.title = "Add task";
    newTaskButton.addEventListener("click", appendNewTaskModal);
    navBar.appendChild(newTaskButton);
    container.appendChild(navBar);
}


function _toggleSideMenu(){
    const sideMenu = document.querySelector("aside");
    sideMenu.classList.toggle("active");
    const sideMenuBackground = document.querySelector(".aside-background");
    sideMenuBackground.classList.toggle("active");
}


function _appendAside(container){
    const asideBackground = document.createElement("section");
    asideBackground.classList.add("aside-background");
    asideBackground.addEventListener("click", _toggleSideMenu);
    container.appendChild(asideBackground);

    const aside = document.createElement("aside");

    const ASIDE_COMPONENTS = {
        inbox: {
            title: "Inbox",
            classes: ["project"],
            attributes: [{key: "data-name", value: "Inbox"}],
            iconClasses: ["fa-solid", "fa-inbox"],
            eventListeners: [
                {event: "click", function: () => {_toggleCurrentProject(".project[data-name='Inbox']")}},
                {event: "click", function: () => {_displayTasks("Inbox")}}
            ]
        },
        today: {
            title: "Today",
            classes: ["project"],
            attributes: [{key: "data-name", value: "Today"}],
            iconClasses: ["fa-solid", "fa-calendar-day"],
            eventListeners: [
                {event: "click", function: () => {_toggleCurrentProject(".project[data-name='Today']")}},
                {event: "click", function: () => {_displayTasks("Today")}}
            ]
        },
        thisWeek: {
            title: "This week",
            classes: ["project"],
            attributes: [{key: "data-name", value: "This-week"}],
            iconClasses: ["fa-solid", "fa-calendar-week"],
            eventListeners: [
                {event: "click", function: () => {_toggleCurrentProject(".project[data-name='This-week']")}},
                {event: "click", function: () => {_displayTasks("This week")}}
            ]
        },
        completed: {
            title: "Completed",
            classes: ["project"],
            attributes: [{key: "data-name", value: "Completed"}],
            iconClasses: ["fa-solid", "fa-square-check"],
            eventListeners: [
                {event: "click", function: () => {_toggleCurrentProject(".project[data-name='Completed']")}},
                {event: "click", function: () => {_displayTasks("Completed")}}
            ]
        }
    }   
    
    for (let component in ASIDE_COMPONENTS){
        component = ASIDE_COMPONENTS[component];
        const componentSection = document.createElement("section");
        componentSection.classList.add(...component.classes);
        component.attributes.forEach(attribute => {componentSection.setAttribute(attribute.key, attribute.value)});
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

function _toggleCurrentProject(projectSelector, event){
    const clickedOnAButton = event && !event.target.classList.contains("project");
    if(clickedOnAButton) return;

    const currentProject = document.querySelector(".project.current");
    const project = document.querySelector(projectSelector);
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
        //PROJECTS_TO_IGNORE is imported from "./data.js"
        if(PROJECTS_TO_IGNORE.includes(projectName)) continue;

        const projectContainer = document.createElement("section");
        projectContainer.classList.add("project");
        projectContainer.setAttribute("data-name", projectName);
        projectContainer.addEventListener("click", (event)=>{_toggleCurrentProject(`.project[data-name='${projectName}']`, event)});
        projectContainer.addEventListener("click", (event)=>{_displayTasks(projectName, event)});
        projects.appendChild(projectContainer);

        const projectTitleWrapper = document.createElement("section");
        projectTitleWrapper.classList.add("project-title-wrapper");
        projectTitleWrapper.style.pointerEvents = "none";

        const projectIcon = document.createElement("i");
        projectIcon.classList.add("fa-solid", getProjectIcon(projectName).class);
        projectIcon.style.pointerEvents = "none";
        projectTitleWrapper.appendChild(projectIcon);

        const projectTitle = document.createElement("span");
        projectTitle.innerText = projectName;
        projectTitle.style.pointerEvents = "none";
        projectTitleWrapper.appendChild(projectTitle);

        projectContainer.appendChild(projectTitleWrapper);

        const PROJECT_BUTTONS = {
            edit: {
                htmlElement: "i",
                id: "edit-project-button",
                classes: ["fa-solid", "fa-pen-to-square"],
                title: "Edit",
                eventListeners: [{event: "click", function: ()=>{
                    if(_viewportInPortraitMode() || _viewportIsNarrow()){
                        _toggleSideMenu();
                    }

                    appendUpdateProjectModal(projectName);
                }}]
            },
            delete: {
                htmlElement: "i",
                id: "delete-project-button",
                classes: ["fa-solid", "fa-trash-can"],
                title: "Delete",
                eventListeners: [{event: "click", function: ()=>{
                    if(_viewportInPortraitMode() || _viewportIsNarrow()){
                        _toggleSideMenu();
                    }

                    appendDeleteProjectModal(projectName);
                }}]
            }
        }

        _appendButtons(PROJECT_BUTTONS, projectContainer);
    }

    const newProjectButton = document.createElement("section");
    newProjectButton.classList.add("new-project-button");
    newProjectButton.title = "Add project";
    newProjectButton.addEventListener("click", ()=>{
        if(_viewportInPortraitMode() || _viewportIsNarrow()){
            _toggleSideMenu();
        }

        appendNewProjectModal();   
    });
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

function _displayTasks(projectName, event){
    const clickedOnAButton = event && !event.target.classList.contains("project");
    if(clickedOnAButton) return;

    const tasksAlreadyOnScreen = document.querySelector(`.project-tasks[data-project-name='${projectName}']`);
    if(tasksAlreadyOnScreen) return;
    
    const isTodaysTasks = (projectName == "Today");
    const isThisWeeksTasks = (projectName == "This week");
    const isCompletedTasks = (projectName === "Completed");

    const projectPage = document.createElement("section");
    projectPage.classList.add("project-tasks");
    projectPage.setAttribute("data-project-name", projectName);

    const projectPageHeader = document.createElement("header");
    projectPage.appendChild(projectPageHeader);
    
    const projectPageTitle = document.createElement("h2");
    projectPageTitle.classList.add("title");
    projectPageTitle.innerText = projectName;
    projectPageHeader.appendChild(projectPageTitle);

    const projectPageTasks = document.createElement("section");
    projectPageTasks.classList.add("tasks");
    
    const tasks = (isTodaysTasks) ? getTodaysTasks() : (isThisWeeksTasks) ? getThisWeeksTasks() : (isCompletedTasks) ? getCompletedTasks() : getProjectTasks(projectName);
    for (const taskName in tasks){
        const task = tasks[taskName];

        const taskSection = document.createElement("section");
        taskSection.classList.add("task");

        const upperSection = document.createElement("section");
        upperSection.classList.add("top", task.priority);
        upperSection.setAttribute("data-id", `${task.title}-from-${task.project}`);
        upperSection.addEventListener("click", (event)=>{_toggleDetails({event})});
        taskSection.appendChild(upperSection);

        const statusCheckbox = document.createElement("input");
        statusCheckbox.classList.add("status-checkbox");
        statusCheckbox.type = "checkbox";
        statusCheckbox.title = "Toggle Status";
        const taskCompleted = task.status;
        if(taskCompleted){
            upperSection.classList.add("done");
            statusCheckbox.checked = true;
        }
        statusCheckbox.addEventListener("change", ()=>{_toggleTaskStatus(task)});
        upperSection.appendChild(statusCheckbox);

        const taskTitle = document.createElement("span");
        taskTitle.classList.add("task-title");
        taskTitle.innerText = task.title;
        taskTitle.style.pointerEvents = "none";
        upperSection.appendChild(taskTitle);

        const TASK_BUTTONS = {
            view: {
                htmlElement: "i",
                id: "view-button",
                classes: ["fa-solid", "fa-circle-info"],
                title: "View",
                eventListeners: [{event: "click", function: ()=>{appendViewTaskModal(task)}}],
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
            priority: {
                htmlElement: "i",
                id: "priority-toggle",
                classes: ["fa-solid", "fa-flag", task.priority],
                title: "Toggle Priority",
                eventListeners: [{event: "click", function: ()=>{_toggleTaskPriority(task)}}],
            },
            delete: {
                htmlElement: "i",
                id: "delete-task-button",
                classes: ["fa-solid", "fa-trash-can"],
                title: "Delete",
                eventListeners: [{event: "click", function: ()=>{appendDeleteTaskModal(task)}}],
            }
        }
        _appendButtons(TASK_BUTTONS, upperSection);
        projectPageTasks.appendChild(taskSection);

        const details = document.createElement("section");
        details.classList.add("task-details", "collapsed");
        details.setAttribute("data-id", `${task.title}-from-${task.project}`);

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
        taskSection.appendChild(details);
    }
    projectPage.appendChild(projectPageTasks);

    const main = document.querySelector("main");
    _clearPreviousPage(main);
    main.appendChild(projectPage);

    // Today and This week don't allow users to add tasks, they just show any task that has its due date set to today or any day of this week
    if(isTodaysTasks || isThisWeeksTasks || isCompletedTasks) return;

    const addTaskButton = document.createElement("section");
    addTaskButton.id = "add-task-button";
    addTaskButton.title = "Add task";
    addTaskButton.addEventListener("click", ()=>{appendNewTaskModalFromProject(projectName)});
    const icon = document.createElement("i");
    icon.classList.add("fa-solid", "fa-plus");
    addTaskButton.appendChild(icon);
    const text = document.createElement("section");
    text.innerText = "Add Task";
    addTaskButton.appendChild(text);
    projectPage.appendChild(addTaskButton);
}


function _toggleTaskStatus(task){
    const currentStatus = task.status;
    const newStatus = !currentStatus;
    task.update("status", newStatus);
    const dataId = `${task.title}-from-${task.project}`;
    const detailsWereOpen = document.querySelector(`.task-details[data-id='${dataId}']:not(.collapsed)`);
    reloadTasks(task.project);
    if(detailsWereOpen) _toggleDetails({dataId});
    displayAlert("Task updated!");
}


function _toggleTaskPriority(task){
    const currentPriority = task.priority;
    const newPriority = (currentPriority === "low") ? "medium" : (currentPriority === "medium") ? "high" : "low";
    task.update("priority", newPriority);
    reloadTasks(task.project);
    displayAlert("Task updated!");
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
    const isToday = document.querySelector(".project-tasks[data-project-name='Today']");
    const isThisWeek = document.querySelector(".project-tasks[data-project-name='This week']");
    const isCompleted = document.querySelector(".project-tasks[data-project-name='Completed']");
    const projectToReload = (isToday) ? "Today" : (isThisWeek) ? "This week" : (isCompleted) ? "Completed" : project;
    document.querySelector("main section.project-tasks").remove();
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


function _toggleDetails({event, dataId}){
    if(event){
        const clickedOnAButton = !event.target.classList.contains("top");
        if(clickedOnAButton) return;
        dataId = event.target.getAttribute("data-id");
    }
    const taskTopSection = document.querySelector(`.task .top[data-id='${dataId}']`);
    taskTopSection.classList.toggle("active");
    const details = document.querySelector(`.task-details[data-id='${dataId}']`);
    details.classList.toggle("collapsed");
}

function _viewportInPortraitMode(){
    return (window.innerHeight > window.innerWidth);
}

function _viewportIsNarrow(){
    return (window.innerWidth < 700);
}