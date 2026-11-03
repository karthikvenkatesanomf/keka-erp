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
import { Employee } from '../../../models/employee.model';
import { EmployeeService } from '../../../services/employee/employee.service';
import { ToasterService } from '../../../components/toaster';

interface DepartmentRoleMapping {
  [department: string]: string[];
}

@Component({
  selector: 'app-upsert-employee',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TextFieldComponent, ButtonComponent, DropdownComponent],
  templateUrl: './upsert-employee.html',
  styleUrl: './upsert-employee.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpsertEmployeeComponent implements OnInit {
  private employeeService = inject(EmployeeService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toaster = inject(ToasterService);

  private readonly departmentRoleMap: DepartmentRoleMapping = {
    IT: ['Developer', 'Tester/QA Engineer', 'DevOps Engineer'],
    Finance: ['Accountant', 'Financial Analyst', 'Auditor', 'Finance Manager', 'Tax Analyst'],
    Sales: ['Sales Executive', 'Business Development Executive', 'Account Manager', 'Sales Manager', 'Pre-Sales Consultant'],
    HR: ['HR Executive', 'Recruiter/Talent Acquisition Specialist', 'Payroll Specialist', 'HR Business Partner', 'HR Manager'],
  };

  protected readonly departmentOptions: DropdownOption[] = [
    { label: 'IT', value: 'IT' },
    { label: 'Finance', value: 'Finance' },
    { label: 'Sales', value: 'Sales' },
    { label: 'HR', value: 'HR' },
  ];

  protected readonly statusOptions: DropdownOption[] = [
    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' },
  ];

  protected readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2)] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    phone: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^\d{10}$/)] }),
    department: new FormControl('IT', { nonNullable: true, validators: [Validators.required] }),
    role: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    status: new FormControl('Active', { nonNullable: true, validators: [Validators.required] }),
    joiningDate: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    branch: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2)] }),
    address: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(10)] }),
  });

  protected readonly submitting = signal(false);
  protected readonly submitError = signal('');
  protected readonly pageLoading = signal(false);
  protected readonly pageError = signal('');
  protected readonly isEditMode = signal(false);
  protected readonly pageTitle = signal('Create New Employee');
  protected readonly submitButtonText = signal('Create Employee');

  protected readonly employeeId = this.route.snapshot.paramMap.get('id');

  protected readonly submitButtonLabel = computed(() =>
    this.submitting() 
      ? (this.isEditMode() ? 'Updating...' : 'Creating...')
      : this.submitButtonText()
  );

  protected readonly roleOptions = computed(() => {
    const selectedDepartment = this.form.controls.department.value;
    const roles = this.departmentRoleMap[selectedDepartment] || [];
    return roles.map(role => ({ label: role, value: role }));
  });

  private readonly errorMessages: Record<string, Record<string, string>> = {
    name: {
      required: 'Name is required.',
      minlength: 'Name must be at least 2 characters.',
    },
    email: {
      required: 'Email is required.',
      email: 'Enter a valid email address.',
    },
    phone: {
      required: 'Phone number is required.',
      pattern: 'Phone number must be 10 digits.',
    },
    department: {
      required: 'Department is required.',
    },
    role: {
      required: 'Role is required.',
    },
    status: {
      required: 'Status is required.',
    },
    joiningDate: {
      required: 'Joining date is required.',
    },
    branch: {
      required: 'Branch is required.',
      minlength: 'Branch must be at least 2 characters.',
    },
    address: {
      required: 'Address is required.',
      minlength: 'Address must be at least 10 characters.',
    },
  };

  protected getError(fieldName: keyof typeof this.errorMessages): string {
    const control = this.form.get(fieldName);
    if (!control?.errors || !control.touched) return '';

    const errors = control.errors;
    const messages = this.errorMessages[fieldName];
    const firstError = Object.keys(errors).find((key) => messages[key]);
    return firstError ? messages[firstError] : '';
  }

  ngOnInit(): void {
    if (this.employeeId) {
      this.isEditMode.set(true);
      this.pageTitle.set('Edit Employee');
      this.submitButtonText.set('Update Employee');
      this.loadResolvedEmployee();
    }
  }

  protected loadResolvedEmployee(): void {
    this.pageLoading.set(true);
    this.pageError.set('');
    
    try {
      const resolvedEmployee = this.route.snapshot.data['employee'] as Employee;
      if (resolvedEmployee) {
        this.populateFormWithEmployee(resolvedEmployee);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to load employee';
      this.pageError.set(errorMsg);
      this.toaster.error(errorMsg, 'Error');
    } finally {
      this.pageLoading.set(false);
    }
  }

  protected populateFormWithEmployee(employee: Employee): void {
    const joiningDate = typeof employee.joiningDate === 'string'
      ? employee.joiningDate
      : (employee.joiningDate as any)?.toISOString?.().split('T')[0] || '';

    this.form.reset({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      department: employee.department,
      role: employee.role,
      status: employee.status,
      joiningDate: joiningDate,
      branch: (employee as any).branch || '',
      address: (employee as any).address || '',
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
      const employeeData: Employee = {
        name: formValue.name,
        email: formValue.email,
        phone: formValue.phone,
        department: formValue.department,
        role: formValue.role,
        status: formValue.status as 'active' | 'inactive' | 'on-leave',
        joiningDate: formValue.joiningDate,
        branch: formValue.branch,
        address: formValue.address,
      } as any;

      if (this.isEditMode() && this.employeeId) {
        await this.employeeService.updateEmployee(this.employeeId, employeeData);
        this.toaster.success('Employee updated successfully!', 'Success');
      } else {
        await this.employeeService.createEmployee(employeeData);
        this.toaster.success('Employee created successfully!', 'Success');
      }

      await this.router.navigate(['/employees']);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to save employee';
      this.submitError.set(errorMsg);
      this.toaster.error(errorMsg, 'Error');
    } finally {
      this.submitting.set(false);
    }
  }

  protected goBack(): void {
    this.router.navigate(['/employees']);
  }
}
