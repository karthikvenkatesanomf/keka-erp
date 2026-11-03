import { Injectable } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { Employee } from '../../models/employee.model';

@Injectable({ providedIn: 'root' })
export class EmployeeService extends FirestoreService {
  protected collectionName = 'employee';

  async getAllEmployees(): Promise<Employee[]> {
    return (await this.getAll()) as unknown as Employee[];
  }

  async getEmployeeById(employeeId: string): Promise<Employee | null> {
    return (await this.getById(employeeId)) as Employee | null;
  }

  async createEmployee(employeeData: Employee): Promise<string> {
    return this.create({ ...employeeData });
  }

  async updateEmployee(
    employeeId: string,
    employeeData: Partial<Employee>
  ): Promise<void> {
    return this.update(employeeId, employeeData);
  }
}
