import { Routes } from '@angular/router';
import { employeeResolver } from './resolvers/employee.resolver';

export const employeeRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./employee-list/employee-list').then((m) => m.EmployeeListComponent),
    title: 'Employees',
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./upsert-employee/upsert-employee').then((m) => m.UpsertEmployeeComponent),
    title: 'Create Employee',
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./upsert-employee/upsert-employee').then((m) => m.UpsertEmployeeComponent),
    title: 'Edit Employee',
    resolve: {
      employee: employeeResolver,
    },
  },
];
