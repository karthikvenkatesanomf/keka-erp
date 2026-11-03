import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
  computed,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetricsCardComponent } from '../../components/metrics-card/metrics-card';
import { ProgressItemComponent } from '../../components/progress-item/progress-item';
import { DashboardService, type UpcomingDeadline, type TaskDistribution, type RecentEmployee } from '../../services/dashboard/dashboard.service';
import { Employee } from '../../models/employee.model';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MetricsCardComponent, ProgressItemComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard implements OnInit {
  private dashboardService = inject(DashboardService);

  employees = signal<Employee[]>([]);
  tasks = signal<Task[]>([]);
  upcomingDeadlines = signal<UpcomingDeadline[]>([]);
  taskDistribution = signal<TaskDistribution>({
    completed: 0,
    inProgress: 0,
    pending: 0,
    total: 0,
    completedPercent: 0,
    inProgressPercent: 0,
    pendingPercent: 0,
  });
  recentEmployees = signal<RecentEmployee[]>([]);
  isLoading = signal(false);

  totalEmployees = computed(() => this.employees().length);

  activeEmployees = computed(() =>
    this.employees().filter((emp) => emp.status?.toLowerCase() === 'active')
      .length
  );

  totalTasks = computed(() => this.tasks().length);

  pendingTasks = computed(() =>
    this.tasks().filter((task) => task.status?.toLowerCase() === 'pending')
      .length
  );

  inProgressTasks = computed(() =>
    this.tasks().filter((task) => task.status?.toLowerCase() === 'in progress')
      .length
  );

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private async loadDashboardData(): Promise<void> {
    this.isLoading.set(true);
    try {
      const { employees, tasks, upcomingDeadlines, taskDistribution, recentEmployees } = await this.dashboardService.getDashboardData();
      this.employees.set(employees);
      this.tasks.set(tasks);
      this.upcomingDeadlines.set(upcomingDeadlines);
      this.taskDistribution.set(taskDistribution);
      this.recentEmployees.set(recentEmployees);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      this.employees.set([]);
      this.tasks.set([]);
      this.upcomingDeadlines.set([]);
      this.taskDistribution.set({
        completed: 0,
        inProgress: 0,
        pending: 0,
        total: 0,
        completedPercent: 0,
        inProgressPercent: 0,
        pendingPercent: 0,
      });
      this.recentEmployees.set([]);
    } finally {
      this.isLoading.set(false);
    }
  }
}
