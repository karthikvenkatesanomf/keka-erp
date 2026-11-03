import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Task } from '../../../models/task.model';
import { TaskService } from '../../../services/task/task.service';

export const taskResolver: ResolveFn<Task> = async (route) => {
  const taskService = inject(TaskService);
  const taskId = route.paramMap.get('id');

  if (!taskId) {
    throw new Error('Task ID is required');
  }

  const task = await taskService.getTaskById(taskId);
  
  if (!task) {
    throw new Error('Task not found');
  }

  return task;
};
