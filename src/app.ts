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

class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    // Selecting template element
    this.templateElement = document.getElementById(
      "project-input"
    )! as HTMLTemplateElement;
    // Selecting the host element
    this.hostElement = document.getElementById("app")! as HTMLDivElement;

    // Importing the node from template
    // true -> deep clone
    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );

    // Selecting the form from the imported node
    this.element = importedNode.firstElementChild as HTMLFormElement;

    // Adding a class to the form
    this.element.id = "user-input";

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
    this.attach();
  }

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
      console.log(title, desc, people);
      this.clearInputs();
    }
  }

  // Setting an event listener when the forms get submitted
  private configure() {
    this.element.addEventListener("submit", this.submitHandler);
  }

  // Rendering the form template
  private attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.element);
  }
}

const projInput = new ProjectInput();
