
import React, { useEffect, useState } from "react";
import { FieldAdvancedPanel } from "./FieldAdvancedPanel";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { updateField } from "@/services/CollectionService";

interface FieldAdvancedTabProps {
  fieldType: string | null;
  fieldId?: string;
  collectionId?: string;
  fieldData?: any;
  onUpdate: (data: any) => void;
}

export function FieldAdvancedTab({ 
  fieldType, 
  fieldId,
  collectionId,
  fieldData, 
  onUpdate 
}: FieldAdvancedTabProps) {
  const [advancedSettings, setAdvancedSettings] = useState<any>(
    fieldData?.advanced || (fieldData?.settings?.advanced || {})
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingToDb, setIsSavingToDb] = useState(false);

  // Update local state when fieldData changes
  useEffect(() => {
    if (fieldData?.advanced) {
      setAdvancedSettings(fieldData.advanced);
    } else if (fieldData?.settings?.advanced) {
      setAdvancedSettings(fieldData.settings.advanced);
    } else {
      setAdvancedSettings({});
    }
  }, [fieldData]);

  // Handle saving advanced settings locally
  const handleLocalSave = (advancedSettings: any) => {
    setIsSaving(true);
    
    try {
      // Log the advanced settings being saved
      console.log("[FieldAdvancedTab] Saving advanced settings locally:", JSON.stringify(advancedSettings, null, 2));
      
      setAdvancedSettings(advancedSettings);
      
      // Create a deep copy of the existing field data to work with
      const updatedData = fieldData ? JSON.parse(JSON.stringify(fieldData)) : {};
      
      // Set the advanced settings
      if (!updatedData.settings) {
        updatedData.settings = {};
      }
      
      updatedData.settings.advanced = advancedSettings;
      
      // Log the complete updated field data
      console.log("[FieldAdvancedTab] Complete updated field data:", JSON.stringify(updatedData, null, 2));
      
      // Update the field data with our deep-copied and merged object
      onUpdate(updatedData);
      
      toast({
        title: "Advanced settings updated locally",
        description: "Your field's advanced settings have been saved locally"
      });
    } catch (error) {
      console.error("[FieldAdvancedTab] Error saving advanced settings:", error);
      toast({
        title: "Error saving settings",
        description: "There was a problem saving your advanced settings",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle saving advanced settings to the database
  const handleDatabaseSave = async (advancedSettings: any) => {
    // Check if we have the required IDs to save to database
    if (!fieldId || !collectionId) {
      toast({
        title: "Missing field or collection ID",
        description: "Cannot save to database without field and collection IDs",
        variant: "destructive"
      });
      return;
    }

    setIsSavingToDb(true);
    
    try {
      // Log the advanced settings being saved to database
      console.log("[FieldAdvancedTab] Saving advanced settings to database:", JSON.stringify(advancedSettings, null, 2));
      console.log("[FieldAdvancedTab] Field ID:", fieldId);
      console.log("[FieldAdvancedTab] Collection ID:", collectionId);
      
      // Create the field data object to update
      const fieldUpdateData = {
        settings: {
          advanced: advancedSettings
        }
      };
      
      // Call the service to update the field in the database
      const updatedField = await updateField(collectionId, fieldId, fieldUpdateData);
      
      console.log("[FieldAdvancedTab] Field updated in database:", updatedField);
      
      // Update local state with the response from the database
      if (updatedField?.settings?.advanced) {
        setAdvancedSettings(updatedField.settings.advanced);
      }
      
      // Create a deep copy of the existing field data to work with
      const updatedData = fieldData ? JSON.parse(JSON.stringify(fieldData)) : {};
      
      // Set the advanced settings in the local state too
      if (!updatedData.settings) {
        updatedData.settings = {};
      }
      
      updatedData.settings.advanced = advancedSettings;
      
      // Update the field data with our deep-copied and merged object
      onUpdate(updatedData);
      
      toast({
        title: "Advanced settings saved to database",
        description: "Your field's advanced settings have been saved to the database"
      });
    } catch (error) {
      console.error("[FieldAdvancedTab] Error saving advanced settings to database:", error);
      toast({
        title: "Error saving settings to database",
        description: "There was a problem saving your advanced settings to the database",
        variant: "destructive"
      });
    } finally {
      setIsSavingToDb(false);
    }
  };

  // Unified save handler that checks if we can save to database
  const handleSaveAdvancedSettings = async (advancedSettings: any) => {
    // Always save locally first
    handleLocalSave(advancedSettings);
    
    // If we have field and collection IDs, also save to the database
    if (fieldId && collectionId) {
      await handleDatabaseSave(advancedSettings);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FieldAdvancedPanel
        fieldType={fieldType}
        fieldId={fieldId}
        collectionId={collectionId}
        initialData={advancedSettings}
        onSave={handleSaveAdvancedSettings}
        onSaveToDatabase={handleDatabaseSave}
        isSaving={isSaving}
        isSavingToDb={isSavingToDb}
      />
    </div>
  );
}

export default FieldAdvancedTab;
