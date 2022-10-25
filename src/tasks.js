import { addTaskToProject, deleteTaskFromProject } from "./projects";

export default class ToDo{
    constructor({title, description = "", priority, project}){ // dueDate
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.status = false;
        this.project = project;
        addTaskToProject(this, project);
    }

    update(property, value){
        this[property] = value;
    }

    moveTo(newProject){
        deleteTaskFromProject(this);
        this.project = newProject;
        addTaskToProject(this, newProject);
    }

    deleteFromProject(){
        deleteTaskFromProject(this);
    }
}