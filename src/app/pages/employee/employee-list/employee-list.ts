import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../../components/button/button';
import { TableComponent, TableColumn } from '../../../components/table/table';
import { LoadingOverlayComponent } from '../../../components/loading-overlay/loading-overlay';
import { Employee } from '../../../models/employee.model';
import { EmployeeService } from '../../../services/employee/employee.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, ButtonComponent, TableComponent, LoadingOverlayComponent],
  providers: [DatePipe],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeListComponent implements OnInit {
  private employeeService = inject(EmployeeService);
  private router = inject(Router);
  private datePipe = inject(DatePipe);

  protected employees = signal<any[]>([]);
  protected isLoading = signal(false);
  protected error = signal<string | null>(null);
  protected isNavigating = signal(false);

  protected columns: TableColumn[] = [
    { key: 'name', label: 'Name', sortable: true, filterable: true },
    { key: 'email', label: 'Email', sortable: true, filterable: true },
    { key: 'phone', label: 'Phone', sortable: true, filterable: true },
    { key: 'department', label: 'Department', sortable: true, filterable: true },
    { key: 'role', label: 'Role', sortable: true, filterable: true },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      filterable: true,
    },
    {
      key: 'joiningDate',
      label: 'Joining Date',
      sortable: true,
      filterable: false,
      template: (value) => this.datePipe.transform(value as Date | string | undefined, 'MMM d, y') || '',
    },
  ];

  ngOnInit(): void {
    this.loadEmployees();
  }

  protected async loadEmployees(): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);
    try {
      const data = await this.employeeService.getAllEmployees();
      this.employees.set(data);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Failed to load employees');
    } finally {
      this.isLoading.set(false);
    }
  }

  protected navigateToCreate(): void {
    this.router.navigate(['/employees/create']);
  }

  protected onRowClick(employee: Employee): void {
    this.isNavigating.set(true);
    this.router.navigate(['/employees', employee.id, 'edit']).finally(() => {
      this.isNavigating.set(false);
    });
  }
}
