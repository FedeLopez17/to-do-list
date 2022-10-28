import isToday from "date-fns/isToday";
import isThisWeek from "date-fns/isThisWeek";

const _PROJECTS = {};

export default class Project{
    constructor(name){
        this.name = name;
        this.tasks = {};
        _PROJECTS[this.name] = this;
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

export function getProjectNames(){
    const projectNames = [];
    for(const project in _PROJECTS){
        projectNames.push(project);
    }
    return projectNames;
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