import { addProjectTask, deleteProjectTask, renameProjectTask, updateLocalStorageProjects } from "./projects";
import format from "date-fns/format";

export default class ToDo{
    constructor({title, description, priority, status = false, dueDate, formattedDate = format(new Date(dueDate), "EEEE do - MMMM - yyyy"), project}){
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.status = status;
        this.dueDate = dueDate;
        this.formattedDate = formattedDate;
        this.project = project;
        addProjectTask(this, project);
    }

    update(property, updatedValue){
        if(this[property] !== updatedValue){
            const isNewTitle = (property === "title");
            if(isNewTitle) renameProjectTask(this, updatedValue);

            const isNewProject = (property === "project");
            if(isNewProject) this.moveTo(updatedValue);

            const isEmptyDescription = (property === "description" && updatedValue.replaceAll(" ", "").length === 0);
            if(isEmptyDescription) updatedValue = "n/a";

            this[property] = updatedValue;
            updateLocalStorageProjects();
        }
    }

    moveTo(newProject){
        deleteProjectTask(this);
        this.project = newProject;
        addProjectTask(this, newProject);
    }

    deleteFromProject(){
        deleteProjectTask(this);
    }
}