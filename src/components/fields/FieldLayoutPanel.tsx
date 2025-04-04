
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

export function FieldLayoutPanel() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium">Layout Settings</h2>
      <p className="text-gray-500">
        Configure how fields are laid out in the collection form
      </p>
      
      <Alert variant="info" className="my-4">
        <InfoIcon className="h-4 w-4" />
        <AlertDescription>
          Layout settings will be available in an upcoming release
        </AlertDescription>
      </Alert>
      
      <div className="opacity-60 pointer-events-none">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="font-medium">Field Layouts</h3>
            <div className="border rounded-md p-4 min-h-40">
              Field arrangement options coming soon
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium">Form Preview</h3>
            <div className="border rounded-md p-4 min-h-40">
              Form preview will display here
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FieldLayoutPanel;
