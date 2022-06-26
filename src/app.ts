// Project Type
enum ProjectStatus {
  Active,
  Finished,
}

class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}

// Project State Management
type Listener<T> = (items: T[]) => void;

class State<T> {
  protected listeners: Listener<T>[] = [];

  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}

class ProjectState extends State<Project> {
  private projects: Project[] = [];
  private static instance: ProjectState;

  private constructor() {
    super();
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }

    this.instance = new ProjectState();
    return this.instance;
  }

  addProject(title: string, description: string, people: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      people,
      ProjectStatus.Active
    );
    this.projects.push(newProject);
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }
}

const projectState = ProjectState.getInstance();

// Validation function
interface ValidationObj {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(inputToValidate: ValidationObj) {
  const value = inputToValidate.value;

  if (inputToValidate.required && value.toString().trim().length === 0) {
    return false;
  }

  if (typeof value === "string") {
    if (
      inputToValidate.minLength &&
      value.trim().length < inputToValidate.minLength
    ) {
      return false;
    }
    if (
      inputToValidate.maxLength &&
      value.trim().length > inputToValidate.maxLength
    ) {
      return false;
    }
  }

  if (typeof value === "number") {
    if (inputToValidate.min && value < inputToValidate.min) {
      return false;
    }
    if (inputToValidate.max && value > inputToValidate.max) {
      return false;
    }
  }

  return true;
}

validate({ value: 20, required: true, min: 2 });

// Autobind Decorator
function Autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjustedDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };
  return adjustedDescriptor;
}

// Component Base Class

abstract class Component<T extends HTMLElement, U extends HTMLElement> {
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

// Rendering Single Project

class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> {
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

  configure() {}

  renderContent() {
    this.element.querySelector("h2")!.innerText = this.project.title;
    this.element.querySelector("h3")!.innerText =
      this.numOfPeople + " assigned";
    this.element.querySelector("p")!.innerText = this.project.description;
  }
}

// Rendering the project lists
class ProjectList extends Component<HTMLDivElement, HTMLElement> {
  assignedProjects: Project[];

  constructor(private type: "active" | "finished") {
    super("project-list", "app", false, `${type}-projects`);

    // Setting an initial value for assigned projects
    this.assignedProjects = [];

    this.configure();
    this.renderContent();
  }

  configure(): void {
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
    console.log(this.element.id);
    for (const projItem of this.assignedProjects) {
      new ProjectItem(this.element.querySelector("ul")!.id, projItem);
    }
  }
}

// Gather user input and validation
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    super("project-input", "app", true, "user-input");

    // Selecting inputs from the form
    // In this case we can't use getElementById because this form is inside a template therefore is not attached to the DOM
    this.titleInputElement = this.element.querySelector(
      "#title"
    ) as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector(
      "#people"
    ) as HTMLInputElement;

    this.configure();
  }

  // Setting an event listener when the forms get submitted
  configure() {
    this.element.addEventListener("submit", this.submitHandler);
  }

  renderContent(): void {}

  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;

    const titleValidation: ValidationObj = {
      value: enteredTitle,
      required: true,
      minLength: 5,
      maxLength: 25,
    };

    const descriptionValidation: ValidationObj = {
      value: enteredDescription,
      required: true,
      minLength: 10,
      maxLength: 50,
    };

    const peopleValidation: ValidationObj = {
      value: +enteredPeople,
      required: true,
      min: 1,
      max: 5,
    };

    if (
      !validate(titleValidation) ||
      !validate(descriptionValidation) ||
      !validate(peopleValidation)
    ) {
      alert("Invalid Input, please try again");
      return;
    } else {
      return [enteredTitle, enteredDescription, +enteredPeople];
    }
  }

  private clearInputs() {
    this.titleInputElement.value = "";
    this.descriptionInputElement.value = "";
    this.peopleInputElement.value = "";
  }

  // Handling form submission
  @Autobind
  private submitHandler(e: Event) {
    e.preventDefault();
    const userInput = this.gatherUserInput();
    if (Array.isArray(userInput)) {
      const [title, desc, people] = userInput;
      projectState.addProject(title, desc, people);
      this.clearInputs();
    }
  }
}

const projInput = new ProjectInput();
const activeProjList = new ProjectList("active");
const finishedProjList = new ProjectList("finished");
