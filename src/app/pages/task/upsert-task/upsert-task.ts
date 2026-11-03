import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TextFieldComponent } from '../../../components/text-field/text-field';
import { ButtonComponent } from '../../../components/button/button';
import { DropdownComponent, DropdownOption } from '../../../components/dropdown/dropdown';
import { Task } from '../../../models/task.model';
import { Employee } from '../../../models/employee.model';
import { TaskService } from '../../../services/task/task.service';
import { EmployeeService } from '../../../services/employee/employee.service';
import { ToasterService } from '../../../components/toaster';

@Component({
  selector: 'app-upsert-task',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TextFieldComponent, ButtonComponent, DropdownComponent],
  templateUrl: './upsert-task.html',
  styleUrl: './upsert-task.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpsertTaskComponent implements OnInit {
  private taskService = inject(TaskService);
  private employeeService = inject(EmployeeService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toaster = inject(ToasterService);

  protected readonly priorityOptions: DropdownOption[] = [
    { label: 'Low', value: 'Low' },
    { label: 'Medium', value: 'Medium' },
    { label: 'High', value: 'High' },
  ];

  protected readonly statusOptions: DropdownOption[] = [
    { label: 'Pending', value: 'Pending' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Cancelled', value: 'Cancelled' },
  ];

  protected employees = signal<Employee[]>([]);
  protected loadingEmployees = signal(false);
  protected pageLoading = signal(false);
  protected pageError = signal('');

  protected employeeOptions = computed(() =>
    this.employees().map(emp => ({
      label: emp.name,
      value: emp.id || '',
    }))
  );

  protected readonly form = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(10)] }),
    assignedTo: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    priority: new FormControl('Low', { nonNullable: true, validators: [Validators.required] }),
    status: new FormControl('Pending', { nonNullable: true, validators: [Validators.required] }),
    dueDate: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  protected readonly submitting = signal(false);
  protected readonly submitError = signal('');
  protected readonly isEditMode = signal(false);
  protected readonly pageTitle = signal('Create New Task');
  protected readonly submitButtonText = signal('Create Task');

  protected readonly taskId = this.route.snapshot.paramMap.get('id');

  protected readonly submitButtonLabel = computed(() =>
    this.submitting() 
      ? (this.isEditMode() ? 'Updating...' : 'Creating...')
      : this.submitButtonText()
  );

  private readonly errorMessages: Record<string, Record<string, string>> = {
    title: {
      required: 'Title is required.',
      minlength: 'Title must be at least 3 characters.',
    },
    description: {
      required: 'Description is required.',
      minlength: 'Description must be at least 10 characters.',
    },
    assignedTo: {
      required: 'Assigned to is required.',
    },
    priority: {
      required: 'Priority is required.',
    },
    status: {
      required: 'Status is required.',
    },
    dueDate: {
      required: 'Due date is required.',
    },
  };

  ngOnInit(): void {
    this.loadEmployees();
    
    if (this.taskId) {
      this.isEditMode.set(true);
      this.pageTitle.set('Edit Task');
      this.submitButtonText.set('Update Task');
      this.loadResolvedTask();
    }
  }

  protected loadResolvedTask(): void {
    this.pageLoading.set(true);
    this.pageError.set('');
    
    try {
      const resolvedTask = this.route.snapshot.data['task'] as Task;
      if (resolvedTask) {
        this.populateFormWithTask(resolvedTask);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to load task';
      this.pageError.set(errorMsg);
      this.toaster.error(errorMsg, 'Error');
    } finally {
      this.pageLoading.set(false);
    }
  }

  protected async loadEmployees(): Promise<void> {
    this.loadingEmployees.set(true);
    try {
      const data = await this.employeeService.getAllEmployees();
      this.employees.set(data);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to load employees';
      this.submitError.set(errorMsg);
      this.toaster.error(errorMsg, 'Error');
    } finally {
      this.loadingEmployees.set(false);
    }
  }

  protected getError(fieldName: keyof typeof this.errorMessages): string {
    const control = this.form.get(fieldName);
    if (!control?.errors || !control.touched) return '';

    const errors = control.errors;
    const messages = this.errorMessages[fieldName];
    const firstError = Object.keys(errors).find((key) => messages[key]);
    return firstError ? messages[firstError] : '';
  }

  protected populateFormWithTask(task: Task): void {
    const dueDate = typeof task.dueDate === 'string'
      ? task.dueDate
      : (task.dueDate as any)?.toISOString?.().split('T')[0] || '';

    this.form.reset({
      title: task.title,
      description: task.description,
      assignedTo: task.assignedTo,
      priority: task.priority,
      status: task.status,
      dueDate: dueDate,
    });
  }

  protected async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toaster.warning('Please fix all validation errors', 'Validation Error');
      return;
    }

    this.submitting.set(true);
    this.submitError.set('');

    try {
      const formValue = this.form.getRawValue();
      const taskData: Task = {
        title: formValue.title,
        description: formValue.description,
        assignedTo: formValue.assignedTo,
        priority: formValue.priority as 'low' | 'medium' | 'high',
        status: formValue.status as 'pending' | 'in-progress' | 'completed' | 'cancelled',
        dueDate: formValue.dueDate
      };

      if (this.isEditMode() && this.taskId) {
        await this.taskService.updateTask(this.taskId, taskData);
        this.toaster.success('Task updated successfully!', 'Success');
      } else {
        await this.taskService.createTask(taskData);
        this.toaster.success('Task created successfully!', 'Success');
      }

      await this.router.navigate(['/tasks']);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to save task';
      this.submitError.set(errorMsg);
      this.toaster.error(errorMsg, 'Error');
    } finally {
      this.submitting.set(false);
    }
  }

  protected goBack(): void {
    this.router.navigate(['/tasks']);
  }
}
