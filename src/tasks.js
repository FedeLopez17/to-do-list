import { addTaskToProject, deleteTaskFromProject, renameProjectTask } from "./projects";
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

    update(property, updatedValue){
        if(this[property] !== updatedValue){
            const isNewTitle = (property === "title");
            if(isNewTitle) renameProjectTask(this, updatedValue);

            const isNewProject = (property === "project");
            if(isNewProject) this.moveTo(updatedValue);

            this[property] = updatedValue;
        }
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