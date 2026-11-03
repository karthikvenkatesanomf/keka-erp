import { Injectable, inject } from '@angular/core';
import { EmployeeService } from '../employee/employee.service';
import { TaskService } from '../task/task.service';
import { Employee } from '../../models/employee.model';
import { Task } from '../../models/task.model';

export interface UpcomingDeadline {
  taskId: string;
  taskTitle: string;
  dueDate: Date;
  daysUntilDue: number;
  priority: string;
}

export interface TaskDistribution {
  completed: number;
  inProgress: number;
  pending: number;
  total: number;
  completedPercent: number;
  inProgressPercent: number;
  pendingPercent: number;
}

export interface RecentEmployee extends Employee {
  displayName: string;
}

export interface DashboardData {
  employees: Employee[];
  tasks: Task[];
  upcomingDeadlines: UpcomingDeadline[];
  taskDistribution: TaskDistribution;
  recentEmployees: RecentEmployee[];
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private employeeService = inject(EmployeeService);
  private taskService = inject(TaskService);

  async getDashboardData(): Promise<DashboardData> {
    const [employees, tasks] = await Promise.all([
      this.employeeService.getAllEmployees(),
      this.taskService.getAllTasks(),
    ]);

    const upcomingDeadlines = this.getUpcomingDeadlines(tasks || []);
    const taskDistribution = this.calculateTaskDistribution(tasks || []);
    const recentEmployees = this.getRecentEmployees(employees || []);

    return {
      employees: employees || [],
      tasks: tasks || [],
      upcomingDeadlines,
      taskDistribution,
      recentEmployees,
    };
  }

  private getUpcomingDeadlines(tasks: Task[]): UpcomingDeadline[] {
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    return tasks
      .filter((task) => {
        const dueDate = new Date(task.dueDate);
        return dueDate >= now && dueDate <= thirtyDaysFromNow;
      })
      .map((task) => ({
        taskId: task.id || '',
        taskTitle: task.title,
        dueDate: new Date(task.dueDate),
        daysUntilDue: this.calculateDaysUntilDue(new Date(task.dueDate)),
        priority: task.priority,
      }))
      .sort((a, b) => a.daysUntilDue - b.daysUntilDue);
  }

  private calculateDaysUntilDue(dueDate: Date): number {
    const now = new Date();
    const diffTime = dueDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  private calculateTaskDistribution(tasks: Task[]): TaskDistribution {
    const completed = tasks.filter((t) => t.status?.toLowerCase() === 'completed').length;
    const inProgress = tasks.filter((t) => t.status?.toLowerCase() === 'in progress').length;
    const pending = tasks.filter((t) => t.status?.toLowerCase() === 'pending').length;
    const total = tasks.length;

    const completedPercent = total > 0 ? Math.round((completed / total) * 100) : 0;
    const inProgressPercent = total > 0 ? Math.round((inProgress / total) * 100) : 0;
    const pendingPercent = total > 0 ? Math.round((pending / total) * 100) : 0;

    return {
      completed,
      inProgress,
      pending,
      total,
      completedPercent,
      inProgressPercent,
      pendingPercent,
    };
  }

  private getRecentEmployees(employees: Employee[]): RecentEmployee[] {
    return employees
      .map((emp) => ({
        ...emp,
        displayName: emp.name || 'Unknown',
      }))
      .sort((a, b) => {
        const dateA = new Date(a.joiningDate).getTime();
        const dateB = new Date(b.joiningDate).getTime();
        return dateB - dateA;
      })
      .slice(0, 5);
  }
}


