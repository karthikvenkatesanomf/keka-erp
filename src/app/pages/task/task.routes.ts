import { Routes } from '@angular/router';
import { taskResolver } from './resolvers/task.resolver';

export const taskRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./task-list/task-list').then((m) => m.TaskListComponent),
    title: 'Tasks',
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./upsert-task/upsert-task').then((m) => m.UpsertTaskComponent),
    title: 'Create Task',
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./upsert-task/upsert-task').then((m) => m.UpsertTaskComponent),
    title: 'Edit Task',
    resolve: {
      task: taskResolver,
    },
  },
];
