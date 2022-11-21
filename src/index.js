import buildUserInterface from "./ui.js";
import Project from "./projects.js";
import { checkForSavedProjects } from "./data.js";
import ToDo from "./tasks.js";

const savedProjects = checkForSavedProjects();

if(savedProjects){
    for(let savedProject in savedProjects){
        const project = savedProjects[savedProject];
        new Project(project.name, project.icon.name);
        for(let savedTask in project.tasks){
            const task = project.tasks[savedTask];
            new ToDo({
                title: task.title,
                description: task.description,
                priority: task.priority,
                status: task.status,
                dueDate: task.dueDate,
                formattedDate: task.formattedDate,
                project: task.project
            });
        }
    }
}
else{
    new Project("Inbox", "inbox");
}

buildUserInterface();