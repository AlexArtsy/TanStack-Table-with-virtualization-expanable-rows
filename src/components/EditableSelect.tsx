import React, { useState, useRef, useEffect } from 'react';
import { Check, X, Edit2, ChevronDown } from 'lucide-react';

interface EditableSelectProps {
  value: string;
  options: { value: string; label: string }[];
  onSave: (newValue: string) => void;
  className?: string;
}

const EditableSelect: React.FC<EditableSelectProps> = ({
  value,
  options,
  onSave,
  className = ''
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isEditing && selectRef.current) {
      selectRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
    setIsOpen(false);
  };

  const handleSelect = (optionValue: string) => {
    setEditValue(optionValue);
    setIsOpen(false);
  };

  const getCurrentLabel = () => {
    const option = options.find(opt => opt.value === value);
    return option ? option.label : value;
  };

  const getEditLabel = () => {
    const option = options.find(opt => opt.value === editValue);
    return option ? option.label : editValue;
  };

  if (isEditing) {
    return (
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1" ref={selectRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-full px-2 py-1 text-sm text-left border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white flex items-center justify-between"
            >
              <span>{getEditLabel()}</span>
              <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                {options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    className={`w-full px-3 py-2 text-sm text-left hover:bg-gray-100 transition-colors ${
                      editValue === option.value ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          
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
      </div>
    );
  }

  return (
    <div className="group flex items-center space-x-2">
      <span className={`text-sm text-gray-700 ${className}`}>{getCurrentLabel()}</span>
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

export default EditableSelect;