import { Autobind } from "../decorators/autobind";
import { projectState } from "../state/project-state";
import { Project, ProjectStatus } from "../models/project";
import { Component } from "./base-component";
import { DragTarget } from "../models/drag-drop";
import { ProjectItem } from "./project-item";

// Rendering the project lists
export class ProjectList
  extends Component<HTMLDivElement, HTMLElement>
  implements DragTarget
{
  assignedProjects: Project[];

  constructor(private type: "active" | "finished") {
    super("project-list", "app", false, `${type}-projects`);

    // Setting an initial value for assigned projects
    this.assignedProjects = [];

    this.configure();
    this.renderContent();
  }

  @Autobind
  dragOverHandler(event: DragEvent): void {
    if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
      event.preventDefault();
      const listEl = this.element.querySelector("ul")!;
      listEl.classList.add("droppable");
    }
  }

  @Autobind
  dropHandler(event: DragEvent): void {
    const projId = event.dataTransfer!.getData("text/plain");
    const status =
      this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished;
    projectState.moveProject(projId, status);
  }

  @Autobind
  dragLeaveHandler(_: DragEvent): void {
    const listEl = this.element.querySelector("ul")!;
    listEl.classList.remove("droppable");
  }

  configure(): void {
    this.element.addEventListener("dragover", this.dragOverHandler);
    this.element.addEventListener("drop", this.dropHandler);
    this.element.addEventListener("dragleave", this.dragLeaveHandler);

    projectState.addListener((projects: Project[]) => {
      const relevantProjects = projects.filter((prj) => {
        if (this.type === "active") {
          return prj.status === ProjectStatus.Active;
        }
        return prj.status === ProjectStatus.Finished;
      });
      this.assignedProjects = relevantProjects;
      this.renderProjects();
    });
  }

  renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector("h2")!.textContent =
      this.type.toUpperCase() + " PROJECTS";
  }

  private renderProjects() {
    this.element.querySelector("ul")!.innerHTML = "";
    for (const projItem of this.assignedProjects) {
      new ProjectItem(this.element.querySelector("ul")!.id, projItem);
    }
  }
}
