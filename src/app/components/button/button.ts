import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.html',
  styleUrl: './button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  @Input() name = '';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() variant: 'primary' | 'secondary' | 'text' = 'primary';
  @Input() size: 'md' | 'sm' = 'md';
  @Input() disabled = false;
  @Input() fullWidth = false;

  @Output() clicked = new EventEmitter<void>();
}
