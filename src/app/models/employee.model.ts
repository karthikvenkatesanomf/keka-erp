export interface Employee extends Record<string, unknown> {
  id?: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  status: string;
  joiningDate: Date | string;
}
