import { Directive, inject } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import { FormDirective } from './form.directive';
import { createValidator, getGroupInPath } from './utils';

@Directive({
  selector: '[ngModelGroup]',
  standalone: true,
  providers: [
    { provide: NG_VALIDATORS, useExisting: FormModelGroupDirective, multi: true },
  ],
})
export class FormModelGroupDirective<T> implements Validator {
  private readonly formDirective = inject(FormDirective);

  public validate(control: AbstractControl): ValidationErrors | null {
    const { ngForm, suite } = this.formDirective;

    const formGroup = control.parent?.controls;
    const controlName =
      Object.keys(formGroup).find(
        (name: string) => control === control.parent?.get(name)
      ) || '';
    const field = getGroupInPath(ngForm.control, controlName, control);
    const validatorFn = createValidator(field, this.formDirective.model, suite);

    return validatorFn(control);
  }
}
