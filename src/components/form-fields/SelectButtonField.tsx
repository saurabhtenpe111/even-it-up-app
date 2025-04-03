
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectButtonFieldProps {
  label?: string;
  options: Array<{ label: string; value: string }>;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  required?: boolean;
  disabled?: boolean;
  helpText?: string;
  className?: string;
  error?: string;
}

export const SelectButtonField = ({
  label,
  options,
  value,
  onChange,
  multiple = false,
  required = false,
  disabled = false,
  helpText,
  className,
  error
}: SelectButtonFieldProps) => {
  // Handle single selection
  const handleSingleValueChange = (newValue: string) => {
    onChange(newValue);
  };

  // Handle multiple selection
  const handleMultipleValueChange = (newValue: string[]) => {
    onChange(newValue);
  };

  // For single selection, convert string to array when using ToggleGroup
  const convertSingleValueToArray = (val: string | string[]): string[] => {
    if (Array.isArray(val)) return val;
    return val ? [val] : [];
  };

  // For multiple selection, convert array to string when using ToggleGroup
  const convertArrayToSingleValue = (val: string[]): string => {
    return val && val.length > 0 ? val[0] : '';
  };

  // Remove an item from multiple selection
  const removeItem = (itemToRemove: string) => {
    if (Array.isArray(value)) {
      const newValue = value.filter(item => item !== itemToRemove);
      onChange(newValue);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <div className="flex items-center">
          <label className="text-sm font-medium">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        </div>
      )}
      
      {multiple ? (
        <ToggleGroup
          type="multiple"
          value={Array.isArray(value) ? value : []}
          onValueChange={handleMultipleValueChange}
          className="flex flex-wrap gap-2"
          disabled={disabled}
        >
          {options.map((option) => (
            <ToggleGroupItem
              key={option.value}
              value={option.value}
              className="data-[state=on]:bg-blue-600 data-[state=on]:text-white"
            >
              {option.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      ) : (
        <ToggleGroup
          type="single"
          value={typeof value === 'string' ? value : ''}
          onValueChange={handleSingleValueChange}
          className="flex flex-wrap gap-2"
          disabled={disabled}
        >
          {options.map((option) => (
            <ToggleGroupItem
              key={option.value}
              value={option.value}
              className="data-[state=on]:bg-blue-600 data-[state=on]:text-white"
            >
              {option.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      )}
      
      {/* Display selected items as pills for multiple selection */}
      {multiple && Array.isArray(value) && value.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {value.map((val) => {
            const option = options.find(opt => opt.value === val);
            return (
              <div 
                key={val} 
                className="flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm"
              >
                {option?.label || val}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 ml-1 -mr-1 hover:bg-blue-200 rounded-full"
                  onClick={() => removeItem(val)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            );
          })}
        </div>
      )}
      
      {helpText && <p className="text-xs text-gray-500">{helpText}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default SelectButtonField;
