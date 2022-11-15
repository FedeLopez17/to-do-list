import isToday from "date-fns/isToday";
import isThisWeek from "date-fns/isThisWeek";

let _PROJECTS = {};

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
        this.orderedTaskNames = [];
        _PROJECTS[this.name] = this;
        _sortProjects();
    }

    sortTasks(){
        const sortedTasks = {};
        this.orderedTaskNames.forEach(taskName => {sortedTasks[taskName] = this.tasks[taskName]});
        this.tasks = sortedTasks;
    }

    getTasks(){
        return this.tasks;
    }

    addTask(task){
        this.tasks[task.title] = task;
        this.orderedTaskNames.push(task.title);
        this.sortTasks();
    }

    renameTask(oldTitle, newTitle){
        this.tasks[newTitle] = this.tasks[oldTitle];
        delete this.tasks[oldTitle];
        this.orderedTaskNames.splice(this.orderedTaskNames.indexOf(oldTitle), 1, newTitle);
        this.sortTasks();
    }

    deleteTask(taskName){
        delete this.tasks[taskName];
        this.orderedTaskNames.splice(this.orderedTaskNames.indexOf(taskName), 1);
        this.sortTasks();
    }

    getIcon(){
        return this.icon;
    }

    setIcon(iconName){
        this.icon.name = iconName;
        this.icon.class = _ICON_CLASSES[iconName];
    }
}

export function logProject(projectName){
    console.log(JSON.stringify(_PROJECTS[projectName].tasks));
   return JSON.stringify(_PROJECTS[projectName].tasks);
}

export function getProject(projectName){
    return _PROJECTS[projectName];
}

export function getProjectNames(){
    const projectNames = [];
    for(const projectName in _PROJECTS){
        projectNames.push(projectName);
    }
    return projectNames;
}

export function getProjectIcon(projectName){
    return _PROJECTS[projectName].getIcon();
}

export function getProjectTasks(projectName){
    return _PROJECTS[projectName].getTasks();
}

export function addProjectTask(task, project){
    _PROJECTS[project].addTask(task);
}

export function renameProjectTask(task, newTaskTitle){
    _PROJECTS[task.project].renameTask(task.title, newTaskTitle);
}

export function deleteProjectTask(task){
    _PROJECTS[task.project].deleteTask(task.title);
}

export function deleteProject(projectName){
    delete _PROJECTS[projectName];
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

    const tasksForTimePeriod = [];

    for (const project in _PROJECTS){
        for (const taskKey in _PROJECTS[project].tasks){
            const task = _PROJECTS[project].tasks[taskKey];
            const taskDueDate = new Date(task.dueDate);
            if(TIME_PERIODS[timePeriod].function(taskDueDate)){
                tasksForTimePeriod.push(task);
            }
        }
    }

    return tasksForTimePeriod;
}