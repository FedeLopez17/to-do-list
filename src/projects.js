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