import { Component, Input, Output, ChangeDetectionStrategy, signal, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { ButtonComponent } from '../button/button';

@Component({
  selector: 'app-text-field',
  imports: [ReactiveFormsModule, ButtonComponent],
  templateUrl: './text-field.html',
  styleUrl: './text-field.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class TextFieldComponent implements OnChanges {
  @Input() control!: FormControl<string>;
  @Input() type: 'text' | 'email' | 'password' | 'date' = 'text';
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() id: string = '';
  @Input() errorMessage: string = '';
  @Input() disabled: boolean = false;
  @Input() isTextArea: boolean = false;

  protected readonly showPassword = signal(false);

  @Output() readonly valueChange = new EventEmitter<string>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['disabled'] && this.control) {
      // Reactive forms ignore the [disabled] attribute; the control's state must be toggled instead.
      if (this.disabled && this.control.enabled) {
        this.control.disable({ emitEvent: false });
      } else if (!this.disabled && this.control.disabled) {
        this.control.enable({ emitEvent: false });
      }
    }
  }

  protected get isPassword(): boolean {
    return this.type === 'password';
  }

  protected get inputType(): 'text' | 'email' | 'password' | 'date' {
    if (!this.isPassword) {
      return (this.type === 'text' || this.type === 'email' || this.type === 'date' ? this.type : 'text') as 'text' | 'email' | 'password' | 'date';
    }
    return this.showPassword() ? 'text' : 'password';
  }

  protected togglePassword(): void {
    this.showPassword.set(!this.showPassword());
  }

  protected onInput(event: Event): void {
    const input = event.target as HTMLInputElement | HTMLTextAreaElement;
    this.valueChange.emit(input.value);
  }
}

