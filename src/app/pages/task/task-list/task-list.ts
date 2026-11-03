import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../../components/button/button';
import { TableComponent, TableColumn } from '../../../components/table/table';
import { LoadingOverlayComponent } from '../../../components/loading-overlay/loading-overlay';
import { Task } from '../../../models/task.model';
import { Employee } from '../../../models/employee.model';
import { TaskService } from '../../../services/task/task.service';
import { EmployeeService } from '../../../services/employee/employee.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, ButtonComponent, TableComponent, LoadingOverlayComponent],
  providers: [DatePipe],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskListComponent implements OnInit {
  private taskService = inject(TaskService);
  private employeeService = inject(EmployeeService);
  private router = inject(Router);
  private datePipe = inject(DatePipe);

  protected tasks = signal<Task[]>([]);
  protected employees = signal<Employee[]>([]);
  protected isLoading = signal(false);
  protected error = signal<string | null>(null);
  protected isNavigating = signal(false);

  protected displayTasks = computed(() =>
    this.tasks().map(task => ({
      ...task,
      assignedTo: this.employees()
        .find(emp => emp.id === task.assignedTo)?.name || task.assignedTo,
    }))
  );

  protected columns: TableColumn[] = [
    { key: 'title', label: 'Title', sortable: true, filterable: true },
    { key: 'assignedTo', label: 'Assigned To', sortable: true, filterable: true },
    { key: 'priority', label: 'Priority', sortable: true, filterable: true },
    { key: 'status', label: 'Status', sortable: true, filterable: true },
    {
      key: 'dueDate',
      label: 'Due Date',
      sortable: true,
      filterable: false,
      template: (value) => this.datePipe.transform(value as Date | string | undefined, 'MMM d, y') || '',
    }
  ];

  ngOnInit(): void {
    this.loadEmployees();
    this.loadTasks();
  }

  protected async loadEmployees(): Promise<void> {
    try {
      const data = await this.employeeService.getAllEmployees();
      this.employees.set(data);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Failed to load employees');
    }
  }

  protected async loadTasks(): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);
    try {
      const data = await this.taskService.getAllTasks();
      this.tasks.set(data);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      this.isLoading.set(false);
    }
  }

  protected navigateToCreate(): void {
    this.router.navigate(['/tasks/create']);
  }

  protected onRowClick(task: Task): void {
    this.isNavigating.set(true);
    this.router.navigate(['/tasks', task.id, 'edit']).finally(() => {
      this.isNavigating.set(false);
    });
  }
}
