import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Divider,
  Chip,
  IconButton,
} from '@mui/material';
import {
  Email,
  Phone,
  LocationOn,
  Work,
  CalendarToday,
  TrendingUp,
  Business,
  Close,
} from '@mui/icons-material';
import { User } from '../types/User';
import MuiEditableField from './MuiEditableField';
import MuiEditableSelect from './MuiEditableSelect';

interface MuiUserDetailCardProps {
  user: User;
  onUpdateUser: (userId: string, field: keyof User, value: string) => void;
}

const MuiUserDetailCard: React.FC<MuiUserDetailCardProps> = ({ user, onUpdateUser, onClose }) => {
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

  const departmentOptions = [
    { value: 'Engineering', label: 'Engineering' },
    { value: 'Product', label: 'Product' },
    { value: 'Design', label: 'Design' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Analytics', label: 'Analytics' },
    { value: 'QA', label: 'QA' }
  ];

  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: User['status']) => {
    switch (status) {
      case 'active':
        return 'Активен';
      case 'inactive':
        return 'Неактивен';
      case 'pending':
        return 'Ожидает';
      default:
        return 'Неизвестно';
    }
  };

  return (
    <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
      <Card
        sx={{
          borderRadius: 2,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          border: '1px solid',
          borderColor: 'primary.100',
          bgcolor: 'background.paper',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          {/* Кнопка закрытия в правом верхнем углу */}
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              position: 'absolute',
              top: 25,
              right: 25,
              bgcolor: 'grey.100',
              '&:hover': {
                bgcolor: 'grey.200',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.2s ease',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}
          >
            <Close fontSize="small" sx={{ color: 'grey.700' }} />
          </IconButton>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" fontWeight={600} color="text.primary">
              Детальная информация
            </Typography>
            <Chip
              label="Редактируемые поля"
              size="small"
              color="primary"
              variant="outlined"
            />
          </Box>

          <Grid container spacing={3}>
            {/* Contact Information */}
            <Grid item xs={12} md={4}>
              <Typography
                variant="subtitle2"
                fontWeight={600}
                color="text.primary"
                sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}
              >
                Контактная информация
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <Email sx={{ color: 'primary.main', mt: 0.5, fontSize: 20 }} />
                  <MuiEditableField
                    value={user.email}
                    onSave={(newValue) => onUpdateUser(user.id, 'email', newValue)}
                    type="email"
                    validation={validateEmail}
                    placeholder="email@company.com"
                    label="Email"
                  />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <Phone sx={{ color: 'primary.main', mt: 0.5, fontSize: 20 }} />
                  <MuiEditableField
                    value={user.phone}
                    onSave={(newValue) => onUpdateUser(user.id, 'phone', newValue)}
                    type="tel"
                    validation={validatePhone}
                    placeholder="+7 (495) 123-45-67"
                    label="Телефон"
                  />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <LocationOn sx={{ color: 'primary.main', mt: 0.5, fontSize: 20 }} />
                  <MuiEditableField
                    value={user.location}
                    onSave={(newValue) => onUpdateUser(user.id, 'location', newValue)}
                    validation={validateRequired}
                    placeholder="Город"
                    label="Местоположение"
                  />
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={1}>
              <Divider orientation="vertical" sx={{ height: '100%', display: { xs: 'none', md: 'block' } }} />
              <Divider sx={{ display: { xs: 'block', md: 'none' } }} />
            </Grid>

            {/* Work Information */}
            <Grid item xs={12} md={3}>
              <Typography
                variant="subtitle2"
                fontWeight={600}
                color="text.primary"
                sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}
              >
                Рабочая информация
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <Work sx={{ color: 'success.main', mt: 0.5, fontSize: 20 }} />
                  <MuiEditableField
                    value={user.role}
                    onSave={(newValue) => onUpdateUser(user.id, 'role', newValue)}
                    validation={validateRequired}
                    placeholder="Должность"
                    label="Должность"
                  />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <Business sx={{ color: 'success.main', mt: 0.5, fontSize: 20 }} />
                  <MuiEditableSelect
                    value={user.department}
                    options={departmentOptions}
                    onSave={(newValue) => onUpdateUser(user.id, 'department', newValue)}
                    label="Отдел"
                  />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <CalendarToday sx={{ color: 'success.main', mt: 0.5, fontSize: 20 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Дата приема
                    </Typography>
                    <Typography variant="body2" color="text.primary">
                      {formatDate(user.joinDate)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={1}>
              <Divider orientation="vertical" sx={{ height: '100%', display: { xs: 'none', md: 'block' } }} />
              <Divider sx={{ display: { xs: 'block', md: 'none' } }} />
            </Grid>

            {/* Activity Information */}
            <Grid item xs={12} md={3}>
              <Typography
                variant="subtitle2"
                fontWeight={600}
                color="text.primary"
                sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}
              >
                Активность
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <TrendingUp sx={{ color: 'warning.main', mt: 0.5, fontSize: 20 }} />
                  <Box sx={{ width: '100%' }}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Проекты
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <MuiEditableField
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
                      />
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      bgcolor: 'warning.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mt: 0.5,
                    }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: 'white',
                      }}
                    />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Последняя активность
                    </Typography>
                    <Typography variant="body2" color="text.primary">
                      {formatLastActivity(user.lastActivity)}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                    Статус
                  </Typography>
                  <Chip
                    label={getStatusLabel(user.status)}
                    color={getStatusColor(user.status)}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default MuiUserDetailCard;