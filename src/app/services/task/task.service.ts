import { Injectable } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { Task } from '../../models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskService extends FirestoreService {
  protected collectionName = 'task';

  async getAllTasks(): Promise<Task[]> {
    return (await this.getAll()) as unknown as Task[];
  }

  async getTaskById(taskId: string): Promise<Task | null> {
    return (await this.getById(taskId)) as Task | null;
  }

  async createTask(taskData: Task): Promise<string> {
    return this.create({ ...taskData });
  }

  async updateTask(
    taskId: string,
    taskData: Partial<Task>
  ): Promise<void> {
    return this.update(taskId, taskData);
  }
}
