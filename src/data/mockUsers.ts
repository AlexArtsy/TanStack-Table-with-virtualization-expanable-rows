import { User } from '../types/User';

// Generate more users for virtualization demo
const generateUser = (id: number): User => {
  const names = [
    'Анна Петрова', 'Дмитрий Иванов', 'Елена Сидорова', 'Алексей Козлов', 
    'Мария Федорова', 'Сергей Морозов', 'Ольга Васильева', 'Николай Смирнов',
    'Татьяна Кузнецова', 'Владимир Попов', 'Екатерина Соколова', 'Андрей Лебедев',
    'Наталья Козлова', 'Михаил Новиков', 'Светлана Морозова', 'Игорь Волков'
  ];
  
  const roles = [
    'Senior Developer', 'Product Manager', 'UX Designer', 'DevOps Engineer',
    'Marketing Specialist', 'Data Analyst', 'QA Engineer', 'Frontend Developer',
    'Backend Developer', 'UI Designer', 'Business Analyst', 'Team Lead'
  ];
  
  const departments = [
    'Engineering', 'Product', 'Design', 'Marketing', 'Analytics', 'QA'
  ];
  
  const locations = [
    'Москва', 'Санкт-Петербург', 'Екатеринбург', 'Новосибирск', 
    'Казань', 'Ростов-на-Дону', 'Краснодар', 'Воронеж'
  ];
  
  const statuses: ('active' | 'inactive' | 'pending')[] = ['active', 'inactive', 'pending'];
  
  const name = names[id % names.length];
  const role = roles[id % roles.length];
  const department = departments[id % departments.length];
  const location = locations[id % locations.length];
  const status = statuses[id % statuses.length];
  
  return {
    id: id.toString(),
    name: `${name} ${id > 15 ? id : ''}`.trim(),
    email: `user${id}@company.com`,
    role,
    department,
    status,
    joinDate: new Date(2020 + (id % 4), (id % 12), (id % 28) + 1).toISOString().split('T')[0],
    phone: `+7 (495) ${String(id).padStart(3, '0')}-${String(id * 2).padStart(2, '0')}-${String(id * 3).padStart(2, '0')}`,
    location,
    projects: (id % 20) + 1,
    lastActivity: new Date(Date.now() - (id % 30) * 24 * 60 * 60 * 1000).toISOString()
  };
};

export const mockUsers: User[] = [
  // Generate 1000 users for virtualization demo
  ...Array.from({ length: 1000 }, (_, i) => generateUser(i + 1))
];