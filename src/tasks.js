import { addTaskToProject, deleteTaskFromProject } from "./projects";

export default class ToDo{
    constructor({title, description = "", priority, dueDate, project}){
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.status = false;
        this.dueDate = dueDate;
        this.project = project;
        addTaskToProject(this, project);
    }

    update(property, value){
        this[property] = value;
    }

    moveTo(newProject){
        console.log(this);
        deleteTaskFromProject(this);
        this.project = newProject;
        addTaskToProject(this, newProject);
    }

    deleteFromProject(){
        deleteTaskFromProject(this);
    }
}