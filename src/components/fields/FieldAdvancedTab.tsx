
import React, { useEffect, useState } from "react";
import { FieldAdvancedPanel } from "./FieldAdvancedPanel";
import { toast } from "@/hooks/use-toast";

interface FieldAdvancedTabProps {
  fieldType: string | null;
  fieldData?: any;
  onUpdate: (data: any) => void;
}

export function FieldAdvancedTab({ fieldType, fieldData, onUpdate }: FieldAdvancedTabProps) {
  const [advancedSettings, setAdvancedSettings] = useState<any>(fieldData?.advanced || {});
  const [isSaving, setIsSaving] = useState(false);

  // Update local state when fieldData changes
  useEffect(() => {
    if (fieldData?.advanced) {
      setAdvancedSettings(fieldData.advanced);
    }
  }, [fieldData]);

  // Handle saving advanced settings
  const handleSaveAdvancedSettings = (advancedSettings: any) => {
    setIsSaving(true);
    setAdvancedSettings(advancedSettings);
    
    try {
      // Merge with existing field data if needed
      const updatedData = {
        ...(fieldData || {}),
        advanced: advancedSettings
      };
      
      // Ensure we don't lose appearance settings if they exist
      if (fieldData?.appearance) {
        updatedData.appearance = fieldData.appearance;
      }
      
      onUpdate(updatedData);
      
      toast({
        title: "Advanced settings updated",
        description: "Your field's advanced settings have been saved"
      });
    } catch (error) {
      console.error("Error saving advanced settings:", error);
      toast({
        title: "Error saving settings",
        description: "There was a problem saving your advanced settings",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <FieldAdvancedPanel
        fieldType={fieldType}
        initialData={advancedSettings}
        onSave={handleSaveAdvancedSettings}
      />
    </div>
  );
}

export default FieldAdvancedTab;
