import { AbstractControl, ValidationErrors } from '@angular/forms';

export function passwordValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;

  if (!value) {
    return null;
  }

  const errors: ValidationErrors = {};

  // Check minimum length
  if (value.length < 8) {
    errors['minlength'] = { requiredLength: 8, actualLength: value.length };
  }

  // Checks maximum length
  if (value.length > 32) {
    errors['maxlength'] = { requiredLength: 32, actualLength: value.length };
  }

  // Checks for uppercase letter
  if (!/[A-Z]/.test(value)) {
    errors['uppercase'] = true;
  }

  // Checks for lowercase letter
  if (!/[a-z]/.test(value)) {
    errors['lowercase'] = true;
  }

  // Checks for number
  if (!/[0-9]/.test(value)) {
    errors['number'] = true;
  }

  // Checks for special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
    errors['specialCharacter'] = true;
  }

  return Object.keys(errors).length > 0 ? errors : null;
}
