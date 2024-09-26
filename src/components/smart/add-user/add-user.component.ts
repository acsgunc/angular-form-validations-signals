import { CommonModule, formatCurrency } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  AfterViewInit,
  Component,
  Signal,
  signal,
  computed,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Subject } from 'rxjs';
import { userValidations } from '../../../validations/user.validations';
import { AddressComponent } from '../../../components/ui/address/address.component';
import { User } from '../../../types/user';
import { FormDirective } from '../../../form-validation/form.directive';
import { Suite } from 'vest';
import { InputWrapperComponent } from '../../../form-validation/input-wrapper.component';
import { FormModelGroupDirective } from '../../../form-validation/form-model-group.directive';
import { FormModelDirective } from '../../../form-validation/form-model.directive';

export type AddUserState = {
  form: User;
  formDirty: boolean;
  formValid: boolean;
  street: string;
};
export type ViewModel = Pick<
  AddUserState,
  'form' | 'formDirty' | 'formValid'
> & {
  passwordDisabled: boolean;
};

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [
    FormsModule,
    FormModelGroupDirective,
    InputWrapperComponent,
    FormDirective,
    FormModelDirective,
    CommonModule,
    AddressComponent,
  ],
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
})
export class AddUserComponent implements AfterViewInit {
  @ViewChild('form') public form: NgForm;
  public readonly suite: Suite<User> = userValidations;

  private readonly formValue = signal(new User());
  private readonly formDirty = signal(true);
  private readonly formValid = signal(true);
  public readonly vm = computed(() => {
    return {
      user: this.formValue(),
      passwordDisabled: this.formValue().address.street === '',
      formValid: this.formValid(),
      formDirty: this.formDirty(),
    };
  });

  public submit(): void {
    console.log(this.formValue());
  }

  public ngAfterViewInit(): void {
    this.form?.valueChanges?.subscribe(v => {
      this.formValue.update(curr => new User({...curr, ...v}))
    });
    this.form?.statusChanges?.subscribe(() => {
      this.formDirty.set(this.form.dirty);
      this.formValid.set(this.form.valid);
    });
  }
}
