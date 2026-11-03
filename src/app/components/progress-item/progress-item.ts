import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-item.html',
  styleUrl: './progress-item.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressItemComponent {
  @Input({ required: true }) label!: string;
  @Input({ required: true }) count!: number;
  @Input({ required: true }) percent!: number;
  @Input({ required: true }) status!: 'completed' | 'inprogress' | 'pending';
}
