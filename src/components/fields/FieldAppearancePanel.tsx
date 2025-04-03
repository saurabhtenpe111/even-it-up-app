
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ColorPicker } from './ColorPicker';
import { Slider } from '@/components/ui/slider';
import { FieldAppearancePanelProps } from './interfaces';

export function FieldAppearancePanel({ 
  fieldType, 
  initialData = {}, 
  onUpdate,
  form
}: FieldAppearancePanelProps) {
  const [settings, setSettings] = useState<any>({
    floatLabel: initialData?.floatLabel || false,
    filled: initialData?.filled || false,
    borderStyle: initialData?.borderStyle || 'solid',
    backgroundColor: initialData?.backgroundColor || '#ffffff',
    textColor: initialData?.textColor || '#000000',
    fontSize: initialData?.fontSize || 16,
    customClass: initialData?.customClass || '',
    inlineStyles: initialData?.inlineStyles || '',
    width: initialData?.width || 100,
    height: initialData?.height || 'auto',
    textAlign: initialData?.textAlign || 'left',
  });

  useEffect(() => {
    if (initialData) {
      setSettings(prev => ({
        ...prev,
        ...initialData
      }));
    }
  }, [initialData]);

  const handleChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    
    const updatedSettings = {
      ...settings,
      [key]: value
    };
    
    onUpdate(updatedSettings);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Field Appearance</h2>
      <p className="text-gray-500">Customize how your field looks</p>
      
      <div className="grid gap-6">
        <div className="flex flex-row items-center justify-between space-x-2 rounded-md border p-3">
          <div>
            <FormLabel>Float Label</FormLabel>
            <FormDescription>Label floats above the input when focused or filled</FormDescription>
          </div>
          <Switch
            checked={settings.floatLabel}
            onCheckedChange={(checked) => handleChange('floatLabel', checked)}
          />
        </div>
        
        <div className="flex flex-row items-center justify-between space-x-2 rounded-md border p-3">
          <div>
            <FormLabel>Filled Style</FormLabel>
            <FormDescription>Field has background color instead of outline</FormDescription>
          </div>
          <Switch
            checked={settings.filled}
            onCheckedChange={(checked) => handleChange('filled', checked)}
          />
        </div>
        
        <FormItem>
          <FormLabel>Border Style</FormLabel>
          <Select
            value={settings.borderStyle}
            onValueChange={(value) => handleChange('borderStyle', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select border style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="solid">Solid</SelectItem>
              <SelectItem value="dashed">Dashed</SelectItem>
              <SelectItem value="dotted">Dotted</SelectItem>
            </SelectContent>
          </Select>
        </FormItem>
        
        <FormItem>
          <FormLabel>Text Alignment</FormLabel>
          <Select
            value={settings.textAlign}
            onValueChange={(value) => handleChange('textAlign', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select text alignment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Left</SelectItem>
              <SelectItem value="center">Center</SelectItem>
              <SelectItem value="right">Right</SelectItem>
            </SelectContent>
          </Select>
        </FormItem>
        
        <div className="grid grid-cols-2 gap-4">
          <FormItem>
            <FormLabel>Background Color</FormLabel>
            <div className="mt-2">
              <ColorPicker
                color={settings.backgroundColor}
                onChange={(color) => handleChange('backgroundColor', color)}
              />
            </div>
          </FormItem>
          
          <FormItem>
            <FormLabel>Text Color</FormLabel>
            <div className="mt-2">
              <ColorPicker
                color={settings.textColor}
                onChange={(color) => handleChange('textColor', color)}
              />
            </div>
          </FormItem>
        </div>
        
        <div>
          <FormLabel>Font Size ({settings.fontSize}px)</FormLabel>
          <Slider
            value={[settings.fontSize]}
            min={10}
            max={24}
            step={1}
            onValueChange={(value) => handleChange('fontSize', value[0])}
            className="mt-2"
          />
        </div>
        
        <FormItem>
          <FormLabel>Width</FormLabel>
          <div className="flex items-center gap-2">
            <Slider
              value={[settings.width]}
              min={25}
              max={100}
              step={5}
              onValueChange={(value) => handleChange('width', value[0])}
              className="flex-1"
            />
            <span className="text-sm">{settings.width}%</span>
          </div>
        </FormItem>
        
        <FormItem>
          <FormLabel>Custom CSS Class</FormLabel>
          <Input 
            value={settings.customClass}
            onChange={(e) => handleChange('customClass', e.target.value)}
            placeholder="Enter custom CSS class name(s)"
          />
          <FormDescription>
            Add your own CSS classes (separate multiple classes with spaces)
          </FormDescription>
        </FormItem>
        
        <FormItem>
          <FormLabel>Custom CSS Styles</FormLabel>
          <Textarea
            value={settings.inlineStyles}
            onChange={(e) => handleChange('inlineStyles', e.target.value)}
            placeholder="margin-top: 10px; text-transform: uppercase;"
            rows={3}
          />
          <FormDescription>
            Add inline CSS styles (property: value; format)
          </FormDescription>
        </FormItem>
      </div>
      
      <div className="rounded-md border p-4 mt-4">
        <h3 className="text-sm font-medium mb-2">Preview:</h3>
        <div
          className={`p-4 ${settings.customClass}`}
          style={{
            backgroundColor: settings.filled ? settings.backgroundColor : 'transparent',
            color: settings.textColor,
            fontSize: `${settings.fontSize}px`,
            borderStyle: settings.borderStyle,
            borderColor: settings.borderStyle !== 'none' ? '#d1d5db' : 'transparent',
            borderWidth: settings.borderStyle !== 'none' ? '1px' : '0',
            width: `${settings.width}%`,
            textAlign: settings.textAlign as 'left' | 'center' | 'right',
          }}
        >
          <div className={`relative ${settings.floatLabel ? 'pt-4' : ''}`}>
            {settings.floatLabel && (
              <span className="absolute top-0 left-0 text-xs text-blue-500">Field Label</span>
            )}
            {fieldType === 'text' && (
              <input 
                type="text" 
                className="w-full bg-transparent outline-none" 
                placeholder="Sample text input"
              />
            )}
            {fieldType === 'number' && (
              <input 
                type="number" 
                className="w-full bg-transparent outline-none" 
                placeholder="123"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FieldAppearancePanel;
