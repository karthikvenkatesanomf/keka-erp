import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-metrics-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './metrics-card.html',
  styleUrl: './metrics-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetricsCardComponent {
  @Input() label!: string;
  @Input() count!: number;
  @Input() status!: 'total' | 'active' | 'pending' | 'inprogress';
}
