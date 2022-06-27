import { Component } from "./base-component.js";
import { Autobind } from "../decorators/autobind.js";
import { Project } from "../models/project.js";
import { Draggable } from "../models/drag-drop.js";

// Rendering Single Project
export class ProjectItem
  extends Component<HTMLUListElement, HTMLLIElement>
  implements Draggable
{
  get numOfPeople() {
    return this.project.people > 1
      ? `${this.project.people} People`
      : "1 Person";
  }

  constructor(hostId: string, private project: Project) {
    super("single-project", hostId, true, project.id);

    this.configure();

    this.renderContent();
  }

  @Autobind
  dragStartHandler(event: DragEvent): void {
    event.dataTransfer!.setData("text/plain", this.project.id);
    event.dataTransfer!.effectAllowed = "move";
  }

  @Autobind
  dragEndHandler(_: DragEvent): void {}

  configure() {
    this.element.addEventListener("dragstart", this.dragStartHandler);
    this.element.addEventListener("dragend", this.dragEndHandler);
  }

  renderContent() {
    this.element.querySelector("h2")!.innerText = this.project.title;
    this.element.querySelector("h3")!.innerText =
      this.numOfPeople + " assigned";
    this.element.querySelector("p")!.innerText = this.project.description;
  }
}
