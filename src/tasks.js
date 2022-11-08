import { addTaskToProject, deleteTaskFromProject } from "./projects";
import format from "date-fns/format";

export default class ToDo{
    constructor({title, description, priority, dueDate, project}){
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.status = false;
        this.dueDate = dueDate;
        this.formattedDate = format(new Date(dueDate), "EEEE do - MMMM - yyyy");
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