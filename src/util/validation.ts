// Validation function
export interface ValidationObj {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

export function validate(inputToValidate: ValidationObj) {
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
