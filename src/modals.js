import "./modals.css";
import ToDo from "./tasks.js";
import Project, { deleteProject, getProject, getProjectNames, getProjectTasks } from "./projects";
import { reloadProjects, reloadTasks } from "./ui";

export function appendUpdateProjectModal(projectName){
    const project = getProject(projectName);
    _appendProjectModal({mode:"update", project});
}

export function appendNewProjectModal(){
    _appendProjectModal({mode: "new"});
}

function _appendProjectModal({mode, project}){

    const isUpdateMode = (mode === "update");

    const MODE_VALUES = {
        new: {
            modalClass: "new",
            modalTitle: "New Project",
            buttonId: "add-project",
            buttonText: "Add Project",
            buttonFunction: _validateAndAddProject
        }, 
        update: {
            modalClass: "update",
            modalTitle: "Update Project",
            buttonId: "update-project",
            buttonText: "Update Project",
            buttonFunction: ()=>{_validateAndUpdateProject(project)}
        }
    }

    const container = document.querySelector("#content");
    
    const modalAlreadyOnScreen = document.querySelector(".project-modal");
    if(modalAlreadyOnScreen) return;

    const modalBackground = document.createElement("section");
    modalBackground.classList.add("modal-background");
    modalBackground.addEventListener("click", _closeModal);

    const projectModal = document.createElement("section");
    projectModal.classList.add(MODE_VALUES[mode].modalClass, "project-modal");

    //Modal header
    const modalHeader = _makeModalHeader(MODE_VALUES[mode].modalTitle);
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
    nameInput.setAttribute("data-modal-name", "name");
    nameInput.maxLength = 30;
    nameInput.autocomplete = "off";
    if(isUpdateMode) nameInput.value = project.name;
    nameWrapper.appendChild(nameInput);
    modalBody.appendChild(nameWrapper);

    const iconWrapper = document.createElement("section");
    iconWrapper.classList.add("icon-wrapper");
    modalBody.appendChild(iconWrapper);

    const iconLabel = document.createElement("span");
    iconLabel.innerText = "Icon:";
    iconWrapper.appendChild(iconLabel);

    const iconContainer = document.createElement("section");
    iconContainer.classList.add("icon-container");
    iconWrapper.appendChild(iconContainer);

    const FA_ICONS = [{id: "project", class: "fa-list-check", isDefault: true}, {id: "finance", class: "fa-sack-dollar"}, {id: "education", class: "fa-book"}, {id: "repairs", class: "fa-screwdriver-wrench"}];

    FA_ICONS.forEach(fontAwesomeIcon => {
        const label = document.createElement("label");
        label.setAttribute("for", fontAwesomeIcon.id);
        iconContainer.appendChild(label);
        const icon = document.createElement("i");
        icon.classList.add("fa-solid", fontAwesomeIcon.class);
        label.appendChild(icon);
        iconContainer.appendChild(label);

        const input = document.createElement("input");
        input.type = "radio";
        input.name = "icon";
        input.id = fontAwesomeIcon.id;
        input.classList.add("hidden");
        if(fontAwesomeIcon.isDefault) input.checked = true;
        if(isUpdateMode && input.id === project.icon.name) input.checked = true;
        iconContainer.appendChild(input);
    })

    projectModal.appendChild(modalBody);

   // Modal footer
   const modalFooter = document.createElement("footer");
   modalFooter.classList.add("modal-footer");
   
   const addProjectButton = document.createElement("button");
   addProjectButton.classList.add("project-modal-button");
   addProjectButton.id = MODE_VALUES[mode].buttonId;
   addProjectButton.innerText = MODE_VALUES[mode].buttonText;
   addProjectButton.addEventListener("click", MODE_VALUES[mode].buttonFunction);
   modalFooter.appendChild(addProjectButton);

   projectModal.appendChild(modalFooter);

   container.appendChild(modalBackground);
   container.appendChild(projectModal);
}

export function appendNewTaskModalFromProject(projectName){
    _appendTaskModal({mode: "new from project", project: projectName});
}

export function appendNewTaskModal(){
    _appendTaskModal({mode: "new"});
}

export function appendUpdateTaskModal(task){
    _appendTaskModal({mode: "update", task});
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
    description.innerHTML = `<span>Description: </span> ${task.description}`;
    descriptionContainer.appendChild(description);
    modalBody.appendChild(descriptionContainer);

    const dueDateContainer = document.createElement("section");
    dueDateContainer.classList.add("due-date-container");
    const dueDate = document.createElement("p");
    dueDate.innerHTML = `<span>Due date: </span> ${new Date(task.dueDate)}`;
    descriptionContainer.appendChild(dueDate);
    modalBody.appendChild(dueDateContainer);

    const priorityContainer = document.createElement("section");
    priorityContainer.classList.add("priority-container");
    const priority = document.createElement("p");
    priority.innerHTML = `<span>Priority: </span> ${task.priority}`;
    priorityContainer.appendChild(priority);
    modalBody.appendChild(priorityContainer);

    const projectContainer = document.createElement("section");
    projectContainer.classList.add("project-container");
    const project = document.createElement("p");
    project.innerHTML = `<span>Project: </span> ${task.project}`;
    projectContainer.appendChild(project);
    modalBody.appendChild(projectContainer);

    taskModal.appendChild(modalBody);

    container.appendChild(modalBackground);
    container.appendChild(taskModal);
}

export function appendDeleteTaskModal(task){
    _appendDeleteModal({mode: "task", task});
}

export function appendDeleteProjectModal(project){
    _appendDeleteModal({mode: "project", project});
}

function _appendDeleteModal({mode, task, project}){

    const MODE_VALUES = {
        task: {
            modalClass: "task-modal",
            warningText: "Are you sure you want to delete this task?",
            deleteFunction: ()=>{_deleteTask(task)}
        }, 
        project: {
            modalClass: "project-modal",
            warningText: "Are you sure you want to delete this project?",
            deleteFunction: ()=>{_deleteProject(project)}
        }
    }


    const container = document.querySelector("#content");
    
    const modalAlreadyOnScreen = document.querySelector(`.${MODE_VALUES[mode].modalClass}`);
    if(modalAlreadyOnScreen) return;

    const modalBackground = document.createElement("section");
    modalBackground.classList.add("modal-background");
    modalBackground.addEventListener("click", _closeModal);

    const deleteModal = document.createElement("section");
    deleteModal.classList.add("delete", MODE_VALUES[mode].modalClass);

    const modalBody = document.createElement("section");
    modalBody.classList.add("modal-body");
    const icon = document.createElement("i");
    icon.classList.add("fa-solid", "fa-circle-exclamation");
    modalBody.appendChild(icon);
    const warning = document.createElement("p");
    warning.innerText = MODE_VALUES[mode].warningText;
    modalBody.appendChild(warning);
    deleteModal.appendChild(modalBody);

    const modalFooter = document.createElement("footer");
    const cancelButton = document.createElement("button");
    cancelButton.classList.add("cancel-button");
    cancelButton.innerText = "Cancel";
    cancelButton.addEventListener("click", _closeModal);
    modalFooter.appendChild(cancelButton);
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("ok-button");
    deleteButton.innerText = "OK";
    deleteButton.addEventListener("click", MODE_VALUES[mode].deleteFunction);
    modalFooter.appendChild(deleteButton);
    deleteModal.appendChild(modalFooter);

    container.appendChild(deleteModal);
}

export function appendMoveTaskModal(task){

    const container = document.querySelector("#content");
    
    const modalAlreadyOnScreen = document.querySelector(".task-modal");
    if(modalAlreadyOnScreen) return;

    const modalBackground = document.createElement("section");
    modalBackground.classList.add("modal-background");
    modalBackground.addEventListener("click", _closeModal);

    const moveTaskModal = document.createElement("section");
    moveTaskModal.classList.add("move", "task-modal");

    //Modal header
    const modalHeader = _makeModalHeader("Move Task");
    moveTaskModal.appendChild(modalHeader);


    //Modal body
    const modalBody = document.createElement("section");
    modalBody.classList.add("modal-body");

    const projectWrapper = document.createElement("section");
    projectWrapper.classList.add("project-wrapper");
    
    const projectLabel = document.createElement("label");
    projectLabel.for = "project";
    projectLabel.innerText = "Project:";
    projectWrapper.appendChild(projectLabel);
    
    const projectInput = document.createElement("select");
    projectInput.id = "project";
    projectInput.setAttribute("data-modal-name", "project");

    const projectNames = getProjectNames();
    for(const projectName of projectNames){
        const option = document.createElement("option");
        option.innerText = projectName;
        option.value = projectName;
        if(projectName === task.project) option.selected = true;
        projectInput.appendChild(option);
    }

    projectWrapper.appendChild(projectInput);
    modalBody.appendChild(projectWrapper);
    moveTaskModal.appendChild(modalBody);

    // Modal footer
    const modalFooter = document.createElement("footer");
    modalFooter.classList.add("modal-footer");
    
    const moveTaskButton = document.createElement("button");
    moveTaskButton.classList.add("task-modal-button");
    moveTaskButton.id = "move-task";
    moveTaskButton.innerText = "Move Task";
    moveTaskButton.addEventListener("click", ()=>{_moveTask(task)});  
    modalFooter.appendChild(moveTaskButton);

    moveTaskModal.appendChild(modalFooter);

    container.appendChild(modalBackground);
    container.appendChild(moveTaskModal);
}

function _appendTaskModal({mode, task, project}){
    const isUpdateTask = (mode === "update");
    let isNewFromProject = false;
    if(mode === "new from project"){
        isNewFromProject = true;
        mode = "new";
    }

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
    
    const titleWrapper = document.createElement("section");
    titleWrapper.classList.add("title-wrapper");
    
    const titleLabel = document.createElement("label");
    titleLabel.for = "title";
    titleLabel.innerText = "Title:";
    titleWrapper.appendChild(titleLabel);
    
    const titleInput = document.createElement("input");
    titleInput.type = "text"
    titleInput.id = "title";
    titleInput.setAttribute("data-modal-name", "title");
    titleInput.maxLength = 30;
    titleInput.addEventListener("input", ()=>{_selfValidation(titleInput)});
    if(isUpdateTask) titleInput.value = task.title;
    titleWrapper.appendChild(titleInput);
    
    modalBody.appendChild(titleWrapper);
    
    const descriptionWrapper = document.createElement("section");
    descriptionWrapper.classList.add("description-wrapper");
    
    const descriptionLabel = document.createElement("label");
    descriptionLabel.for = "description";
    descriptionLabel.innerText = "Description:";
    descriptionWrapper.appendChild(descriptionLabel);
    
    const descriptionInput = document.createElement("input");
    descriptionInput.type = "textarea";
    descriptionInput.id = "description";
    descriptionInput.setAttribute("data-modal-name", "description");
    if(isUpdateTask) descriptionInput.value = task.description;
    descriptionWrapper.appendChild(descriptionInput);
    
    modalBody.appendChild(descriptionWrapper);

    const dueDateWrapper = document.createElement("section");
    dueDateWrapper.classList.add("due-date-wrapper");

    const dueDateLabel = document.createElement("label");
    dueDateLabel.for = "due-date";
    dueDateLabel.innerText = "Due date:";
    dueDateWrapper.appendChild(dueDateLabel);

    const dueDateInput = document.createElement("input");
    dueDateInput.type = "datetime-local";
    dueDateInput.id = "dueDate";
    dueDateInput.setAttribute("data-modal-name", "due date");
    dueDateInput.addEventListener("input", ()=>{_selfValidation(dueDateInput)});
    if(isUpdateTask) dueDateInput.value = task.dueDate;
    dueDateWrapper.appendChild(dueDateInput);

    modalBody.appendChild(dueDateWrapper);

    
    const priorityWrapper = document.createElement("section");
    priorityWrapper.classList.add("priority-wrapper");
    
    const priorityLabel = document.createElement("label");
    priorityLabel.for = "priority"
    priorityLabel.innerText = "Priority:"
    priorityWrapper.appendChild(priorityLabel);
    
    const priorityInput = document.createElement("select");
    priorityInput.id = "priority";
    priorityInput.setAttribute("data-modal-name", "priority");
    const PRIORITY_LEVELS = ["low", "medium", "high"];
    PRIORITY_LEVELS.forEach(priorityLevel => {
        const option = document.createElement("option");
        option.innerText = priorityLevel;
        option.value = priorityLevel;
        option.id = priorityLevel;
        priorityInput.appendChild(option);
    })
    if(isUpdateTask) priorityInput.value = task.priority;
    priorityWrapper.appendChild(priorityInput);
    
    modalBody.appendChild(priorityWrapper);
    
    const projectWrapper = document.createElement("section");
    projectWrapper.classList.add("project-wrapper");
    
    const projectLabel = document.createElement("label");
    projectLabel.for = "project";
    projectLabel.innerText = "Project:";
    projectWrapper.appendChild(projectLabel);
    
    const projectInput = document.createElement("select");
    projectInput.id = "project";
    projectInput.setAttribute("data-modal-name", "project");
    const projectNames = getProjectNames();
    for(const projectName of projectNames){
        const option = document.createElement("option");
        option.innerText = projectName;
        option.value = projectName;
        projectInput.appendChild(option);
    }
    if(isUpdateTask) projectInput.value = task.project;
    if(isNewFromProject) projectInput.value = project;
    projectWrapper.appendChild(projectInput);
    
    modalBody.appendChild(projectWrapper);
    
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
    _validateProjectAndCarryThrough({isAddMode: true});
}

function _validateAndUpdateProject(outdatedProject){
    _validateProjectAndCarryThrough({isAddMode: false, outdatedProject});
}

function _validateProjectAndCarryThrough({isAddMode, outdatedProject}){
    const isUpdateMode = !isAddMode;
    const currentProjects = getProjectNames();
    const nameInput = document.querySelector(".project-modal input#name");
    const nameNotInProjects = !currentProjects.includes(nameInput.value);
    const isSameName = outdatedProject ? (nameInput.value === outdatedProject.name) : false;
    const addCondition = isAddMode && nameNotInProjects && _isValid(nameInput);
    const updateCondition = isUpdateMode && _isValid(nameInput) && nameNotInProjects || isUpdateMode && isSameName;
    if (addCondition || updateCondition){
        const chosenName = nameInput.value;
        const chosenIcon = document.querySelector(".project-modal input[type='radio']:checked").id;
        isAddMode ? _addProject(chosenName, chosenIcon) : _updateProject(chosenName, chosenIcon, outdatedProject);
        _closeModal();
        return;
    }

    const invalidText = (!_isValid(nameInput)) ? "Invalid name!" : "This project already exists!";
    
    if(!nameInput.classList.contains("invalid")){
        nameInput.classList.add("invalid");
        const invalidMessage = document.createElement("p");
        invalidMessage.classList.add("invalid-message");
        invalidMessage.innerText = invalidText;
        nameInput.parentElement.appendChild(invalidMessage);
    }

    const invalidMessageOnScreen = document.querySelector(".invalid-message");
    if(invalidMessageOnScreen.innerText != invalidText){
        invalidMessageOnScreen.innerText = invalidText;
    }

}

function _addProject(projectName, projectIcon){
    const project = new Project(projectName, projectIcon);
    reloadProjects();
    return project;
}

function _updateProject(updatedName, updatedIcon, outdatedProject){
    const isSameName = (updatedName === outdatedProject.name);
    const isDifferentIcon = (updatedIcon !== outdatedProject.icon.name);
    const onlyTheIconIsDifferent = isSameName && isDifferentIcon;

    if(onlyTheIconIsDifferent){
        outdatedProject.setIcon(updatedIcon);
    }
    else{
        const updatedProject = _addProject(updatedName, updatedIcon);
        _migrateTasks(outdatedProject, updatedProject);
        deleteProject(outdatedProject.name);
        const projectTasksOnScreen = document.querySelector(`.${outdatedProject.name.replaceAll(" ", "-")}-page.project`);
        if(projectTasksOnScreen) reloadTasks(updatedName);
    }

    reloadProjects();
}

function _migrateTasks(originProject, recipientProject){
    for(const task in originProject.tasks){
        originProject.tasks[task].moveTo(recipientProject.name);
    }
}

function _validateAndAddTask(){
    const inputsAreValid = _validateInputs();
    if(!inputsAreValid) return;
    const taskAlreadyExists = !_addNewTask();
    if(taskAlreadyExists) {
        const titleInput = document.querySelector(".task-modal input#title");
        if(titleInput.classList.contains("valid")){
            titleInput.classList.remove("valid");
            titleInput.classList.add("invalid");
        }
        _displayWarningAfterInput(titleInput, "This task already exists within this project!");
    }
}

function _displayWarningAfterInput(input, warningMessage){

    const inputAlreadyHasAWarning = _isFollowedByAWarning(input);
    if(inputAlreadyHasAWarning) return;

    const warning = document.createElement("p");
    warning.classList.add("warning");
    warning.innerText = warningMessage;
    input.after(warning);
    input.addEventListener("input", ()=>{
        if(_isFollowedByAWarning(input)){
            input.nextSibling.remove();
        }
    }, {once: true});
}

function _isFollowedByAWarning(input){
    return input.nextSibling && input.nextSibling.classList.contains("warning");
}

function _validateAndUpdateTask(task){
    const inputsAreValid = _validateInputs();
    if(inputsAreValid){
        _updateTask(task);
    }
}

function _addNewTask(){
    const OPTIONAL_FIELDS = {description: {defaultValue: "n/a"}};
    const inputs = document.querySelectorAll(".new.task-modal input, .new.task-modal select");
    const task = {};
    for(const input of inputs){
        task[input.id] = input.value || OPTIONAL_FIELDS[input.id].defaultValue;
    }

    // Don't allow the user to add tasks with the same name in the same project
    if(getProjectTasks(task.project)[task.title]) return false;

    new ToDo(task);

    const taskBelongsToCurrentProject = document.querySelector(`.${task.project.replaceAll(" ", "-")}-page`);
    if(taskBelongsToCurrentProject){reloadTasks(task.project)};

    _closeModal();
    return true;
}

function _updateTask(task){
    const selectedProject = document.querySelector(".task-modal select#project").value;
    if(task.project !== selectedProject) _moveTask(task);

    const inputs = document.querySelectorAll(".update.task-modal input, .update.task-modal select");
    for(const input of inputs){
        task.update(input.id, input.value);
    }

    reloadTasks(task.project);
    _closeModal();
}

function _moveTask(task){
    const previousProject = task.project;
    const selectedProject = document.querySelector(".task-modal select#project").value;
    task.moveTo(selectedProject);
    reloadTasks(previousProject);
    _closeModal();
}

function _deleteTask(task){
    task.deleteFromProject();
    reloadTasks(task.project);
    _closeModal();
}

function _deleteProject(project){
    deleteProject(project);
    reloadProjects();
    const deletedProjectOnScreen = document.querySelector(`.${project.replaceAll(" ", "-")}-page.project`);
    if(deletedProjectOnScreen) reloadTasks("Inbox");
    _closeModal();
}


function _validateInputs(){

    const inputs = document.querySelectorAll(".task-modal input:not(#description), .task-modal select");

    let allInputsAreValid = true;

    for (const input of inputs){
        if(_isValid(input)){
            input.classList.add("valid");
        }
        else{
            input.classList.add("invalid");
            _displayWarningAfterInput(input, `Invalid task ${input.getAttribute("data-modal-name")}`);
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