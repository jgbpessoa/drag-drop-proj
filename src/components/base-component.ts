// Component Base Class
export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  hostElement: T;
  element: U;

  constructor(
    templateId: string,
    hostElementId: string,
    insertAtStart: boolean,
    newElementId?: string
  ) {
    // Selecting template element
    this.templateElement = document.getElementById(
      templateId
    )! as HTMLTemplateElement;

    // Selecting the host element
    this.hostElement = document.getElementById(hostElementId)! as T;

    // Importing the node from template
    // true -> deep clone
    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );

    // Selecting the form from the imported node
    this.element = importedNode.firstElementChild as U;
    if (newElementId) {
      // Adding styling id
      this.element.id = newElementId;
    }

    this.attach(insertAtStart);
  }

  private attach(insertAtStart: boolean) {
    this.hostElement.insertAdjacentElement(
      insertAtStart ? "afterbegin" : "beforeend",
      this.element
    );
  }

  abstract configure(): void;
  abstract renderContent(): void;
}
