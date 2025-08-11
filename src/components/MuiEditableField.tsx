import React, { useState } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Typography,
} from '@mui/material';
import {
  Edit,
  Check,
  Close,
} from '@mui/icons-material';

interface MuiEditableFieldProps {
  value: string;
  onSave: (newValue: string) => void;
  type?: 'text' | 'email' | 'tel';
  placeholder?: string;
  validation?: (value: string) => string | null;
  label?: string;
  multiline?: boolean;
}

const MuiEditableField: React.FC<MuiEditableFieldProps> = ({
  value,
  onSave,
  type = 'text',
  placeholder,
  validation,
  label,
  multiline = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    if (validation) {
      const validationError = validation(editValue);
      if (validationError) {
        setError(validationError);
        return;
      }
    }
    
    setError(null);
    onSave(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setError(null);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, width: '100%' }}>
        <TextField
          fullWidth
          size="small"
          type={type}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          error={!!error}
          helperText={error}
          multiline={multiline}
          rows={multiline ? 2 : 1}
          autoFocus
          sx={{ '& .MuiOutlinedInput-root': { fontSize: '0.875rem' } }}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <IconButton
            size="small"
            onClick={handleSave}
            color="success"
            sx={{ p: 0.5 }}
          >
            <Check fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={handleCancel}
            color="error"
            sx={{ p: 0.5 }}
          >
            <Close fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        width: '100%',
        '&:hover .edit-button': {
          opacity: 1,
        },
      }}
    >
      <Box sx={{ flex: 1 }}>
        {label && (
          <Typography variant="caption" color="text.secondary" display="block">
            {label}
          </Typography>
        )}
        <Typography variant="body2" color="text.primary">
          {value}
        </Typography>
      </Box>
      <IconButton
        size="small"
        onClick={() => setIsEditing(true)}
        className="edit-button"
        sx={{
          opacity: 0,
          transition: 'opacity 0.2s',
          p: 0.5,
          color: 'text.secondary',
          '&:hover': {
            color: 'primary.main',
            bgcolor: 'primary.50',
          },
        }}
      >
        <Edit fontSize="small" />
      </IconButton>
    </Box>
  );
};

export default MuiEditableField;