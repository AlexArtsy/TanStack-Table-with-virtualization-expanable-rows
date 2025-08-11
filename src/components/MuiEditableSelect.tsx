import React, { useState } from 'react';
import {
  Box,
  Select,
  MenuItem,
  IconButton,
  Typography,
  FormControl,
} from '@mui/material';
import {
  Edit,
  Check,
  Close,
} from '@mui/icons-material';

interface MuiEditableSelectProps {
  value: string;
  options: { value: string; label: string }[];
  onSave: (newValue: string) => void;
  label?: string;
}

const MuiEditableSelect: React.FC<MuiEditableSelectProps> = ({
  value,
  options,
  onSave,
  label,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const getCurrentLabel = () => {
    const option = options.find(opt => opt.value === value);
    return option ? option.label : value;
  };

  if (isEditing) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
        <FormControl size="small" fullWidth>
          <Select
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            sx={{ fontSize: '0.875rem' }}
          >
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
          {getCurrentLabel()}
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

export default MuiEditableSelect;