import { addTaskToProject } from "./projects";

export default class ToDo{
    constructor({title, description = "", priority, project}){ // dueDate, checklist
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.status = 0;
        this.project = project;
        addTaskToProject(this, project);
    }

    update(property, value){
        this[property] = value;
    }
}