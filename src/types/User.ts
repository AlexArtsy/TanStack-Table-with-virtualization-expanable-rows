export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'active' | 'inactive' | 'pending';
  joinDate: string;
  phone: string;
  location: string;
  projects: number;
  lastActivity: string;
}