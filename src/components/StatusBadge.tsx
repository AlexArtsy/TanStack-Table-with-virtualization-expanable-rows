import React from 'react';

interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'pending';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'active':
        return {
          label: 'Активен',
          className: 'bg-green-100 text-green-800 border-green-200'
        };
      case 'inactive':
        return {
          label: 'Неактивен',
          className: 'bg-red-100 text-red-800 border-red-200'
        };
      case 'pending':
        return {
          label: 'Ожидает',
          className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
        };
      default:
        return {
          label: 'Неизвестно',
          className: 'bg-gray-100 text-gray-800 border-gray-200'
        };
    }
  };

  const { label, className } = getStatusConfig();

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${className}`}>
      {label}
    </span>
  );
};

export default StatusBadge;