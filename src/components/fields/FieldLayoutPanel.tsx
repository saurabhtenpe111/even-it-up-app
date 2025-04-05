
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

export function FieldLayoutPanel() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium">Layout Settings</h2>
      <p className="text-gray-500">
        Configure how fields are laid out in the collection form
      </p>
      
      <Alert variant="info" className="my-4">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Coming Soon</AlertTitle>
        <AlertDescription>
          Advanced layout settings will be fully available in an upcoming release. The preview below shows the planned features.
        </AlertDescription>
      </Alert>
      
      <div className="opacity-60 pointer-events-none">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-medium">Field Layouts</h3>
            <Card className="p-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Layout Type</label>
                  <ToggleGroup type="single" defaultValue="standard" className="justify-start">
                    <ToggleGroupItem value="standard">Standard</ToggleGroupItem>
                    <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
                    <ToggleGroupItem value="tabs">Tabs</ToggleGroupItem>
                  </ToggleGroup>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Responsive Behavior</label>
                  <ToggleGroup type="single" defaultValue="stack" className="justify-start">
                    <ToggleGroupItem value="stack">Stack on Mobile</ToggleGroupItem>
                    <ToggleGroupItem value="scroll">Horizontal Scroll</ToggleGroupItem>
                    <ToggleGroupItem value="collapse">Collapsible</ToggleGroupItem>
                  </ToggleGroup>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Field Spacing</label>
                  <ToggleGroup type="single" defaultValue="medium" className="justify-start">
                    <ToggleGroupItem value="compact">Compact</ToggleGroupItem>
                    <ToggleGroupItem value="medium">Medium</ToggleGroupItem>
                    <ToggleGroupItem value="relaxed">Relaxed</ToggleGroupItem>
                  </ToggleGroup>
                </div>
              </div>
            </Card>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium">Form Preview</h3>
            <Card className="p-4 min-h-64">
              <div className="space-y-4 border p-4 rounded-md bg-gray-50">
                <div className="h-6 w-3/4 bg-gray-200 rounded"></div>
                <div className="h-10 w-full bg-gray-200 rounded"></div>
                <div className="h-6 w-3/4 bg-gray-200 rounded"></div>
                <div className="h-10 w-full bg-gray-200 rounded"></div>
                <div className="h-6 w-2/4 bg-gray-200 rounded"></div>
                <div className="h-24 w-full bg-gray-200 rounded"></div>
                <div className="flex justify-end">
                  <div className="h-10 w-24 bg-blue-200 rounded"></div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FieldLayoutPanel;
