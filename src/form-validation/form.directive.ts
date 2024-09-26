import { Directive, inject, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SuiteResult } from 'vest';

@Directive({
  selector: 'form[model][suite]',
  standalone: true,
})
export class FormDirective<T> {
  @Input() public model: T;
  @Input() public suite: (model: T, field: string) => SuiteResult;
  public readonly ngForm = inject(NgForm, { self: true });
}
