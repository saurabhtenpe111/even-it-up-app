
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { UIVariantsTab } from "./UIVariantsTab";
import { ColorsTab } from "./ColorsTab";
import { ThemeTab } from "./ThemeTab";
import { CustomCSSTab } from "./CustomCSSTab";
import { FieldPreview } from "./FieldPreview";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { SaveIcon } from "lucide-react";

interface FieldAppearancePanelProps {
  fieldType: string | null;
  initialData?: any;
  onSave: (data: any) => void;
}

export function FieldAppearancePanel({ 
  fieldType, 
  initialData = {}, 
  onSave 
}: FieldAppearancePanelProps) {
  const [activeSubtab, setActiveSubtab] = useState("uiVariants");
  const [previewState, setPreviewState] = useState<'default' | 'hover' | 'focus' | 'disabled' | 'error'>('default');
  const [isDarkMode, setIsDarkMode] = useState(initialData?.isDarkMode || false);
  const [isSaving, setIsSaving] = useState(false);
  
  // State for appearance settings
  const [settings, setSettings] = useState({
    uiVariant: initialData?.uiVariant || 'standard',
    theme: initialData?.theme || 'classic',
    colors: initialData?.colors || {
      border: '#e2e8f0',
      text: '#1e293b',
      background: '#ffffff',
      focus: '#3b82f6',
      label: '#64748b'
    },
    customCSS: initialData?.customCSS || '',
    isDarkMode: initialData?.isDarkMode || false,
    textAlign: initialData?.textAlign || 'left',
    labelPosition: initialData?.labelPosition || 'top',
    labelWidth: initialData?.labelWidth || 30,
    floatLabel: initialData?.floatLabel || false,
    filled: initialData?.filled || false,
    showBorder: initialData?.showBorder !== false,
    showBackground: initialData?.showBackground || false,
    roundedCorners: initialData?.roundedCorners || 'medium',
    fieldSize: initialData?.fieldSize || 'medium',
    labelSize: initialData?.labelSize || 'medium',
    customCss: initialData?.customCss || '',
    customClass: initialData?.customClass || '',
    ...initialData
  });
  
  console.log("Initial appearance data:", initialData);
  
  // Update settings when initialData changes
  useEffect(() => {
    if (initialData) {
      setSettings(prevSettings => ({
        ...prevSettings,
        ...initialData,
        colors: initialData?.colors || prevSettings.colors,
        isDarkMode: initialData?.isDarkMode || prevSettings.isDarkMode
      }));
      
      if (initialData.isDarkMode !== undefined) {
        setIsDarkMode(initialData.isDarkMode);
      }
    }
  }, [initialData]);
  
  // Update settings and save to parent
  const updateSettings = (newSettings: Partial<typeof settings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    
    console.log("Updated appearance settings:", updatedSettings);
  };
  
  // Save all settings to parent component
  const saveAllSettings = () => {
    setIsSaving(true);
    
    try {
      console.log("Saving appearance settings:", settings);
      onSave(settings);
      
      toast({
        title: "Appearance settings saved",
        description: "Your changes have been saved successfully"
      });
    } catch (error) {
      console.error("Error saving appearance settings:", error);
      toast({
        title: "Error saving settings",
        description: "There was a problem saving your appearance settings",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <Tabs value={activeSubtab} onValueChange={setActiveSubtab}>
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="uiVariants">UI Variants</TabsTrigger>
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="theme">Theme</TabsTrigger>
          <TabsTrigger value="customCSS">Custom CSS</TabsTrigger>
        </TabsList>
        
        {activeSubtab !== "customCSS" && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Preview</h3>
              <FieldPreview 
                fieldType={fieldType} 
                settings={settings} 
                previewState={previewState}
                isDarkMode={isDarkMode}
                onPreviewStateChange={setPreviewState}
                onDarkModeChange={(isDark) => {
                  setIsDarkMode(isDark);
                  updateSettings({ isDarkMode: isDark });
                }}
              />
            </CardContent>
          </Card>
        )}
        
        <TabsContent value="uiVariants">
          <UIVariantsTab 
            settings={settings} 
            onUpdate={updateSettings} 
          />
        </TabsContent>
        
        <TabsContent value="colors">
          <ColorsTab 
            settings={settings} 
            onUpdate={updateSettings} 
          />
        </TabsContent>
        
        <TabsContent value="theme">
          <ThemeTab 
            settings={settings} 
            onUpdate={updateSettings} 
          />
        </TabsContent>
        
        <TabsContent value="customCSS">
          <CustomCSSTab 
            settings={settings} 
            onUpdate={updateSettings} 
          />
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end">
        <Button 
          onClick={saveAllSettings} 
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <SaveIcon className="mr-2 h-4 w-4" />
          {isSaving ? "Saving..." : "Save All Appearance Settings"}
        </Button>
      </div>
    </div>
  );
}

export default FieldAppearancePanel;
