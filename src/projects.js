import isToday from "date-fns/isToday";
import isThisWeek from "date-fns/isThisWeek";

let _PROJECTS = {}; //Maybe this should be in the prototype or static part of the class?

function _sortProjects(){
    const sortedProjects = {};
    const unorderedProjectNames = Object.keys(_PROJECTS);
    const orderedProjectNames = unorderedProjectNames.sort();
    orderedProjectNames.forEach(projectName => {
        sortedProjects[projectName] = _PROJECTS[projectName];
    })
    _PROJECTS = sortedProjects;
}

const _ICON_CLASSES = {inbox: "fa-inbox", project: "fa-list-check", finance: "fa-sack-dollar", education: "fa-book", repairs: "fa-screwdriver-wrench"};

export default class Project{
    constructor(name, icon){
        this.name = name;
        this.icon = {name: icon, class: _ICON_CLASSES[icon]};
        this.tasks = {};
        _PROJECTS[this.name] = this;
        _sortProjects();
        console.log(this);
    }

    getIcon(){
        return this.icon;
    }

    setIcon(iconName){
        this.icon.name = iconName;
        this.icon.class = _ICON_CLASSES[iconName];
    }

    addTask(task){
        this.tasks[task.title] = task;
    }

    deleteTask(task){
        delete this.tasks[task.title];
    }

    getTasks(){
        return this.tasks;
    }
}

export function getProject(projectName){
    return _PROJECTS[projectName];
}

export function getProjectNames(){
    const projectNames = [];
    for(const project in _PROJECTS){
        projectNames.push(project);
    }
    return projectNames;
}

export function getProjectIcon(project){
    return _PROJECTS[project].getIcon();
}

export function addTaskToProject(task, project){
    _PROJECTS[project].addTask(task);
}

export function getProjectTasks(project){
    return _PROJECTS[project].getTasks();
}

export function deleteTaskFromProject(task){
    _PROJECTS[task.project].deleteTask(task);
}

export function deleteProject(project){
    delete _PROJECTS[project];
}

export function getTodaysTasks(){
    const todaysTasks = _getTasksForTimePeriod("today");
    return todaysTasks;
}

export function getThisWeeksTasks(){
    const thisWeeksTasks = _getTasksForTimePeriod("week");
    return thisWeeksTasks;
}

function _getTasksForTimePeriod(timePeriod){

    const TIME_PERIODS = {"today" : {function : isToday}, "week" : {function : isThisWeek}};

    const tasksForTimePeriod = {};

    for (const project in _PROJECTS){
        for (const taskKey in _PROJECTS[project].tasks){
            const task = _PROJECTS[project].tasks[taskKey];
            const taskDueDate = new Date(task.dueDate);
            if(TIME_PERIODS[timePeriod].function(taskDueDate)){
                tasksForTimePeriod[task.title] = task;
            }
        }
    }

    return tasksForTimePeriod;
}