import "./modals.css";
import ToDo from "./tasks.js";
import Project, { getProjectNames } from "./projects";
import { reloadProjects, reloadTasks } from "./ui";

export function appendNewProjectModal(){
    const container = document.querySelector("#content");
    
    const modalAlreadyOnScreen = document.querySelector(".project-modal");
    if(modalAlreadyOnScreen) return;

    const modalBackground = document.createElement("section");
    modalBackground.classList.add("modal-background");
    modalBackground.addEventListener("click", _closeModal);

    const projectModal = document.createElement("section");
    projectModal.classList.add("new", "project-modal");

    //Modal header
    const modalHeader = _makeModalHeader("New Project");
    projectModal.appendChild(modalHeader);

    //Modal body
    const modalBody = document.createElement("section");
    modalBody.classList.add("modal-body");

    const nameWrapper = document.createElement("section");
    nameWrapper.classList.add("name-wrapper");
    modalBody.appendChild(nameWrapper);

    const nameLabel = document.createElement("label");
    nameLabel.for = "name";
    nameLabel.innerText = "Name:";
    nameWrapper.appendChild(nameLabel);

    const nameInput = document.createElement("input");
    nameInput.type = "text"
    nameInput.id = "name";
    nameInput.maxLength = 30;
    nameWrapper.appendChild(nameInput);
    modalBody.appendChild(nameWrapper);

    projectModal.appendChild(modalBody);

   // Modal footer
   const modalFooter = document.createElement("footer");
   modalFooter.classList.add("modal-footer");
   
   const addProjectButton = document.createElement("button");
   addProjectButton.classList.add("project-modal-button");
   addProjectButton.id = "add-project";
   addProjectButton.innerText = "Add Project";
   addProjectButton.addEventListener("click", _validateAndAddProject);
   modalFooter.appendChild(addProjectButton);

   projectModal.appendChild(modalFooter);

   container.appendChild(modalBackground);
   container.appendChild(projectModal);
}

export function appendNewTaskModal(){
    _appendTaskModal("new");
}

export function appendUpdateTaskModal(task){
    _appendTaskModal("update", task);
}

export function appendViewTaskModal(task){
    const container = document.querySelector("#content");
    
    const modalAlreadyOnScreen = document.querySelector(".task-modal");
    if(modalAlreadyOnScreen) return;

    const modalBackground = document.createElement("section");
    modalBackground.classList.add("modal-background");
    modalBackground.addEventListener("click", _closeModal);

    const taskModal = document.createElement("section");
    taskModal.classList.add("view", "task-modal");

    //Modal header
    const modalHeader = _makeModalHeader(task.title);
    taskModal.appendChild(modalHeader);

    //Modal body
    const modalBody = document.createElement("section");
    modalBody.classList.add("modal-body");

    const descriptionContainer = document.createElement("section");
    descriptionContainer.classList.add("description-container");
    const description = document.createElement("p");
    description.innerHTML =`<span>Description: </span> ${task.description}`;
    descriptionContainer.appendChild(description);
    modalBody.appendChild(descriptionContainer);

    const priorityContainer = document.createElement("section");
    priorityContainer.classList.add("priority-container");
    const priority = document.createElement("p");
    priority.innerHTML =`<span>Priority: </span> ${task.priority}`;
    priorityContainer.appendChild(priority);
    modalBody.appendChild(priorityContainer);


    const projectContainer = document.createElement("section");
    projectContainer.classList.add("project-container");
    const project = document.createElement("p");
    project.innerHTML =`<span>Project: </span> ${task.project}`;
    projectContainer.appendChild(project);
    modalBody.appendChild(projectContainer);

    taskModal.appendChild(modalBody);

    container.appendChild(modalBackground);
    container.appendChild(taskModal);
}

function _appendTaskModal(mode, task){
    const isUpdateTask = (mode === "update");

    const MODE_VALUES = {
        new: {
            modalClass: "new",
            modalTitle: "New Task",
            buttonId: "add-task",
            buttonText: "Add Task",
            buttonFunction: _validateAndAddTask
        }, 
        update: {
            modalClass: "update",
            modalTitle: "Update Task",
            buttonId: "update-task",
            buttonText: "Update Task",
            buttonFunction: ()=>{_validateAndUpdateTask(task)}
        }
    }

    const container = document.querySelector("#content");
    
    const modalAlreadyOnScreen = document.querySelector(".task-modal");
    if(modalAlreadyOnScreen) return;
    
    const modalBackground = document.createElement("section");
    modalBackground.classList.add("modal-background");
    modalBackground.addEventListener("click", _closeModal);
    
    const taskModal = document.createElement("section");
    taskModal.classList.add(MODE_VALUES[mode].modalClass, "task-modal");
    
    //Modal header
    const title = MODE_VALUES[mode].modalTitle;
    const modalHeader = _makeModalHeader(title);
    taskModal.appendChild(modalHeader);
    
    //Modal body
    const modalBody = document.createElement("section");
    modalBody.classList.add("modal-body");
    
    const firstHalf = document.createElement("section");
    firstHalf.classList.add("first-half");
    
    const titleWrapper = document.createElement("section");
    titleWrapper.classList.add("title-wrapper");
    
    const titleLabel = document.createElement("label");
    titleLabel.for = "title";
    titleLabel.innerText = "Title:";
    titleWrapper.appendChild(titleLabel);
    
    const titleInput = document.createElement("input");
    titleInput.type = "text"
    titleInput.id = "title";
    titleInput.maxLength = 30;
    titleInput.addEventListener("input", ()=>{_selfValidation(titleInput)});
    if(isUpdateTask) titleInput.value = task.title;
    titleWrapper.appendChild(titleInput);
    
    firstHalf.appendChild(titleWrapper);
    
    const descriptionWrapper = document.createElement("section");
    descriptionWrapper.classList.add("description-wrapper");
    
    const descriptionLabel = document.createElement("label");
    descriptionLabel.for = "description";
    descriptionLabel.innerText = "Description:";
    descriptionWrapper.appendChild(descriptionLabel);
    
    const descriptionInput = document.createElement("input");
    descriptionInput.type = "textarea";
    descriptionInput.id = "description";
    descriptionInput.addEventListener("input", ()=>{_selfValidation(descriptionInput)});
    if(isUpdateTask) descriptionInput.value = task.description;
    descriptionWrapper.appendChild(descriptionInput);
    
    firstHalf.appendChild(descriptionWrapper);
    
    modalBody.appendChild(firstHalf);
    
    const secondHalf = document.createElement("section");
    secondHalf.classList.add("second-half");
    
    // DUE DATE
    
    const priorityWrapper = document.createElement("section");
    priorityWrapper.classList.add("priority-wrapper");
    
    const priorityLabel = document.createElement("label");
    priorityLabel.for = "priority"
    priorityLabel.innerText = "Priority:"
    priorityWrapper.appendChild(priorityLabel);
    
    const priorityInput = document.createElement("select");
    priorityInput.id = "priority";
    const PRIORITY_LEVELS = ["Low", "Medium", "High"];
    PRIORITY_LEVELS.forEach(priorityLevel => {
        const option = document.createElement("option");
        option.innerText = priorityLevel;
        option.value = priorityLevel.toLowerCase();
        option.id = priorityLevel.toLowerCase();
        priorityInput.appendChild(option);
    })
    if(isUpdateTask) priorityInput.value = task.priority;
    priorityWrapper.appendChild(priorityInput);
    
    secondHalf.appendChild(priorityWrapper);
    
    const projectWrapper = document.createElement("section");
    projectWrapper.classList.add("project-wrapper");
    
    const projectLabel = document.createElement("label");
    projectLabel.for = "project";
    projectLabel.innerText = "Project:";
    projectWrapper.appendChild(projectLabel);
    
    const projectInput = document.createElement("select");
    projectInput.id = "project";
    const projects = getProjectNames();
    projects.forEach(project => {
        const option = document.createElement("option");
        option.innerText = project;
        option.value = project;
        projectInput.appendChild(option);
    })
    if(isUpdateTask) projectInput.value = task.project;
    projectWrapper.appendChild(projectInput);
    
    secondHalf.appendChild(projectWrapper);
    
    modalBody.appendChild(secondHalf);
    
    taskModal.appendChild(modalBody);

    // Modal footer
    const modalFooter = document.createElement("footer");
    modalFooter.classList.add("modal-footer");
    
    const addTaskButton = document.createElement("button");
    addTaskButton.classList.add("task-modal-button");
    addTaskButton.id = MODE_VALUES[mode].buttonId;
    addTaskButton.innerText = MODE_VALUES[mode].buttonText;
    addTaskButton.addEventListener("click", MODE_VALUES[mode].buttonFunction);
    
    modalFooter.appendChild(addTaskButton);
    
    taskModal.appendChild(modalFooter);

    container.appendChild(modalBackground);
    container.appendChild(taskModal);
}

function _makeModalHeader(title){
    const modalHeader = document.createElement("header");
    modalHeader.classList.add("modal-header");
    
    const modalTitle = document.createElement("p")
    modalTitle.classList.add("modal-title");
    modalTitle.innerText = title;
    modalHeader.appendChild(modalTitle);
    
    const closeButton = document.createElement("i");
    closeButton.classList.add("modal-close-button", "fa-solid", "fa-xmark");
    closeButton.addEventListener("click", _closeModal);
    modalHeader.appendChild(closeButton);
    
    return modalHeader;
}

function _validateAndAddProject(){
    const currentProjects = getProjectNames();
    const nameInput = document.querySelector(".project-modal input#name");
    const nameNotInProjects = !currentProjects.includes(nameInput.value);
    if (nameNotInProjects){
        _addProject(nameInput.value);
        _closeModal();
        return;
    }
    if(!nameInput.classList.contains("invalid")){
        nameInput.classList.add("invalid");
        const invalidMessage = document.createElement("p");
        invalidMessage.classList.add("invalid-message");
        invalidMessage.innerText = "This project already exists!";
        nameInput.parentElement.appendChild(invalidMessage);
    }
}

function _addProject(projectName){
    new Project(projectName);
    reloadProjects();
}

function _validateAndAddTask(){
    const inputsAreValid = _validateInputs();
    if(inputsAreValid){
        _addNewTask();
    }
}

function _validateAndUpdateTask(task){
    const inputsAreValid = _validateInputs();
    if(inputsAreValid){
        _updateTask(task);
    }
}

function _addNewTask(){
    const inputs = document.querySelectorAll(".new.task-modal input, .new.task-modal select");
    const task = {};
    for(const input of inputs){
        task[input.id] = input.value;
    }
    new ToDo(task);

    const taskBelongsToCurrentProject = document.querySelector(`.${task.project.toLowerCase().replaceAll(" ", "-")}-page`);
    if(taskBelongsToCurrentProject){reloadTasks(task.project)};

    _closeModal();
}

function _updateTask(task){
    const inputs = document.querySelectorAll(".update.task-modal input, .update.task-modal select");
    for(const input of inputs){
        task.update(input.id, input.value);
    }
    reloadTasks(task.project);

    _closeModal();
}

function _validateInputs(){
    const inputs = document.querySelectorAll(".task-modal input, .task-modal select");

    let allInputsAreValid = true;

    for (const input of inputs){
        if(_isValid(input)){
            input.classList.add("valid");
        }
        else{
            input.classList.add("invalid");
            if(allInputsAreValid) allInputsAreValid = false;
        }
    }

    return allInputsAreValid;
}

function _isValid(input){
    return (input.value.length > 0 && input.value[0] !== " ");
}

function _selfValidation(input){
    if(_isValid(input) && input.classList.contains("invalid")){
        input.classList.remove("invalid");
        if(!input.classList.contains("valid")){input.classList.add("valid")};
    }
    else if (!_isValid(input) && input.classList.contains("valid")){
        input.classList.remove("valid");
        if(!input.classList.contains("invalid")){input.classList.add("invalid")};
    }
}

function _closeModal(){
    [".modal-background", ".task-modal", ".project-modal"].forEach(elementClass =>{
        if(document.querySelector(elementClass)){
            document.querySelector(elementClass).remove();
        }
    })
}