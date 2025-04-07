
import React from 'react';
import { ValidationSettings } from '@/services/CollectionService';

interface FieldValidationPanelProps {
  fieldType: string | null;
  initialData: ValidationSettings;
  onUpdate: (data: ValidationSettings) => void;
}

export function FieldValidationPanel({ 
  fieldType, 
  initialData, 
  onUpdate 
}: FieldValidationPanelProps) {
  // Basic implementation to prevent errors
  React.useEffect(() => {
    // Send initial data back to parent on first render
    onUpdate(initialData);
  }, [initialData, onUpdate]);
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium mb-4">Field Validation</h3>
      <p className="text-gray-500">Field validation settings for {fieldType} type.</p>
    </div>
  );
}

export default FieldValidationPanel;
