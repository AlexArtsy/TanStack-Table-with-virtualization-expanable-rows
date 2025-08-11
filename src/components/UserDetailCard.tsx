import React from 'react';
import { User } from '../types/User';
import { Calendar, MapPin, Phone, Mail, Briefcase, Activity } from 'lucide-react';
import EditableField from './EditableField';
import EditableSelect from './EditableSelect';

interface UserDetailCardProps {
  user: User;
  onUpdateUser: (userId: string, field: keyof User, value: string) => void;
}

const UserDetailCard: React.FC<UserDetailCardProps> = ({ user, onUpdateUser }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatLastActivity = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Только что';
    if (diffInHours < 24) return `${diffInHours} ч. назад`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} дн. назад`;
  };

  const validateEmail = (email: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) return 'Email не может быть пустым';
    if (!emailRegex.test(email)) return 'Введите корректный email';
    return null;
  };

  const validatePhone = (phone: string): string | null => {
    const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
    if (!phone.trim()) return 'Телефон не может быть пустым';
    if (!phoneRegex.test(phone)) return 'Формат: +7 (495) 123-45-67';
    return null;
  };

  const validateRequired = (value: string): string | null => {
    if (!value.trim()) return 'Поле не может быть пустым';
    return null;
  };

  const statusOptions = [
    { value: 'active', label: 'Активен' },
    { value: 'inactive', label: 'Неактивен' },
    { value: 'pending', label: 'Ожидает' }
  ];

  const departmentOptions = [
    { value: 'Engineering', label: 'Engineering' },
    { value: 'Product', label: 'Product' },
    { value: 'Design', label: 'Design' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Analytics', label: 'Analytics' },
    { value: 'QA', label: 'QA' }
  ];

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 mx-4 mb-4 rounded-lg border border-blue-100 relative">
      <div className="absolute top-4 right-4">
        <div className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
          Редактируемые поля
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Contact Information */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
            Контактная информация
          </h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-blue-500" />
              <EditableField
                value={user.email}
                onSave={(newValue) => onUpdateUser(user.id, 'email', newValue)}
                type="email"
                validation={validateEmail}
                placeholder="email@company.com"
              />
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-4 w-4 text-blue-500" />
              <EditableField
                value={user.phone}
                onSave={(newValue) => onUpdateUser(user.id, 'phone', newValue)}
                type="tel"
                validation={validatePhone}
                placeholder="+7 (495) 123-45-67"
              />
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="h-4 w-4 text-blue-500" />
              <EditableField
                value={user.location}
                onSave={(newValue) => onUpdateUser(user.id, 'location', newValue)}
                validation={validateRequired}
                placeholder="Город"
              />
            </div>
          </div>
        </div>

        {/* Work Information */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
            Рабочая информация
          </h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Briefcase className="h-4 w-4 text-green-500" />
              <div>
                <EditableField
                  value={user.role}
                  onSave={(newValue) => onUpdateUser(user.id, 'role', newValue)}
                  validation={validateRequired}
                  placeholder="Должность"
                  className="font-medium text-gray-900"
                />
                <div className="mt-1">
                  <EditableSelect
                    value={user.department}
                    options={departmentOptions}
                    onSave={(newValue) => onUpdateUser(user.id, 'department', newValue)}
                    className="text-xs text-gray-500"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="h-4 w-4 text-green-500" />
              <div>
                <div className="text-sm font-medium text-gray-900">Дата приема</div>
                <div className="text-xs text-gray-500">{formatDate(user.joinDate)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Information */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
            Активность
          </h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Activity className="h-4 w-4 text-purple-500" />
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">Проектов:</span>
                  <EditableField
                    value={user.projects.toString()}
                    onSave={(newValue) => {
                      const numValue = parseInt(newValue);
                      if (!isNaN(numValue) && numValue >= 0) {
                        onUpdateUser(user.id, 'projects', numValue.toString());
                      }
                    }}
                    validation={(value) => {
                      const num = parseInt(value);
                      if (isNaN(num)) return 'Введите число';
                      if (num < 0) return 'Число должно быть положительным';
                      return null;
                    }}
                    placeholder="0"
                    className="font-medium text-gray-900"
                  />
                </div>
                <div className="text-xs text-gray-500">Активных проектов</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-4 w-4 rounded-full bg-purple-500 flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-white"></div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">Последняя активность</div>
                <div className="text-xs text-gray-500">{formatLastActivity(user.lastActivity)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailCard;