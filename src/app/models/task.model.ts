export interface Task extends Record<string, unknown> {
  id?: string;
  title: string;
  description: string;
  assignedTo: string;
  priority: string;
  status: string;
  dueDate: Date | string;
}
