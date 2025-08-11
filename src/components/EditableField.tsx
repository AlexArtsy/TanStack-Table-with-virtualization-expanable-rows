import React, { useState, useRef, useEffect } from 'react';
import { Check, X, Edit2 } from 'lucide-react';

interface EditableFieldProps {
  value: string;
  onSave: (newValue: string) => void;
  type?: 'text' | 'email' | 'tel';
  placeholder?: string;
  className?: string;
  validation?: (value: string) => string | null;
}

const EditableField: React.FC<EditableFieldProps> = ({
  value,
  onSave,
  type = 'text',
  placeholder,
  className = '',
  validation
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

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
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <input
            ref={inputRef}
            type={type}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={`flex-1 px-2 py-1 text-sm border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              error ? 'border-red-300' : 'border-gray-300'
            } ${className}`}
          />
          <button
            onClick={handleSave}
            className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
            title="Сохранить"
          >
            <Check className="h-4 w-4" />
          </button>
          <button
            onClick={handleCancel}
            className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
            title="Отменить"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {error && (
          <p className="text-xs text-red-600">{error}</p>
        )}
      </div>
    );
  }

  return (
    <div className="group flex items-center space-x-2">
      <span className={`text-sm text-gray-700 ${className}`}>{value}</span>
      <button
        onClick={() => setIsEditing(true)}
        className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all"
        title="Редактировать"
      >
        <Edit2 className="h-3 w-3" />
      </button>
    </div>
  );
};

export default EditableField;