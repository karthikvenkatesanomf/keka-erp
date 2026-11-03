import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../services/auth/auth.service';
import { TextFieldComponent } from '../../components/text-field/text-field';
import { ButtonComponent } from '../../components/button/button';
import { KekaIconComponent } from '../../components/icons/keka-icon/keka-icon.component';
import { passwordValidator } from '../../validators/password.validator';
import { ToasterService } from '../../components/toaster';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, TextFieldComponent, ButtonComponent, KekaIconComponent],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private toastr = inject(ToasterService);

  protected readonly form = new FormGroup({
    email: new FormControl(
      '', { nonNullable: true, validators: [Validators.required, Validators.email] }
    ),
    password: new FormControl(
      '', { nonNullable: true, validators: [Validators.required, passwordValidator] }
    ),
  });

  protected readonly submitting = signal(false);
  protected readonly errorMessage = signal('');

  private readonly errorMessages: Record<'email' | 'password', Record<string, string>> = {
    email: {
      required: 'Enter your email address.',
      email: 'Enter a valid email address.',
    },
    password: {
      required: 'Enter your password.',
      minlength: 'Your password must be at least 8 characters.',
      maxlength: 'Your password must not exceed 32 characters.',
      uppercase: 'Your password must contain at least one uppercase letter.',
      lowercase: 'Your password must contain at least one lowercase letter.',
      number: 'Your password must contain at least one number.',
      specialCharacter: 'Your password must contain at least one special character (!@#$%^&* etc.).',
    },
  };

  protected getError(field: 'email' | 'password'): string {
    const errors = this.form.controls[field].errors;
    if (!errors) return '';

    const messages = this.errorMessages[field];
    const firstError = Object.keys(errors).find((key) => messages[key]);
    return firstError ? messages[firstError] : '';
  }

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastr.warning('Please fix all validation errors', 'Validation Error');
      return;
    }

    const { email, password } = this.form.getRawValue();
    this.submitting.set(true);
    this.errorMessage.set('');

    try {
      await this.auth.signIn(email, password);
      this.toastr.success('Login successful', 'Success');
      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');

      if (returnUrl?.startsWith('/') && !returnUrl.startsWith('//')) {
        await this.router.navigateByUrl(returnUrl);
      } else {
        await this.router.navigateByUrl('/dashboard');
      }
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : 'Unable to sign in. Please try again.';
      this.errorMessage.set(errorMsg);
      this.toastr.error(errorMsg, 'Login Failed');
    } finally {
      this.submitting.set(false);
    }
  }
}
