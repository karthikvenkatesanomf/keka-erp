import { Component, Input, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface DropdownOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-dropdown',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './dropdown.html',
  styleUrl: './dropdown.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class DropdownComponent implements OnChanges {
  @Input() control!: FormControl<string>;
  @Input() label: string = '';
  @Input() placeholder: string = 'Select an option';
  @Input() id: string = '';
  @Input() errorMessage: string = '';
  @Input() disabled: boolean = false;
  @Input() options: DropdownOption[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['disabled'] && this.control) {
      if (this.disabled && this.control.enabled) {
        this.control.disable({ emitEvent: false });
      } else if (!this.disabled && this.control.disabled) {
        this.control.enable({ emitEvent: false });
      }
    }
  }
}
