import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Employee } from '../../../models/employee.model';
import { EmployeeService } from '../../../services/employee/employee.service';

export const employeeResolver: ResolveFn<Employee> = async (route) => {
  const employeeService = inject(EmployeeService);
  const employeeId = route.paramMap.get('id');

  if (!employeeId) {
    throw new Error('Employee ID is required');
  }

  const employee = await employeeService.getEmployeeById(employeeId);
  
  if (!employee) {
    throw new Error('Employee not found');
  }

  return employee;
};
