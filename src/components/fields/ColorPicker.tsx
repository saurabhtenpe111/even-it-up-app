
import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  className?: string;
}

export function ColorPicker({ color, onChange, className }: ColorPickerProps) {
  const [selectedColor, setSelectedColor] = useState(color || '#000000');
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Common color presets
  const colorPresets = [
    '#ffffff', '#000000', '#f44336', '#e91e63', '#9c27b0', 
    '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', 
    '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', 
    '#ffc107', '#ff9800', '#ff5722', '#795548', '#607d8b'
  ];

  useEffect(() => {
    setSelectedColor(color);
  }, [color]);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setSelectedColor(newColor);
    onChange(newColor);
  };

  const handlePresetClick = (preset: string) => {
    setSelectedColor(preset);
    onChange(preset);
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-between p-2 h-10"
            onClick={() => setIsOpen(true)}
          >
            <div className="flex items-center gap-2">
              <div 
                className="w-6 h-6 rounded-md border border-gray-200" 
                style={{ backgroundColor: selectedColor }}
              />
              <span>{selectedColor}</span>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3">
          <div className="space-y-3">
            <div>
              <Input 
                ref={inputRef}
                type="color" 
                value={selectedColor} 
                onChange={handleColorChange}
                className="h-10"
              />
            </div>
            <div className="grid grid-cols-5 gap-2">
              {colorPresets.map((preset) => (
                <button
                  key={preset}
                  className={cn(
                    "w-full h-6 rounded-md border", 
                    selectedColor === preset ? "ring-2 ring-primary" : "ring-0"
                  )}
                  style={{ backgroundColor: preset }}
                  onClick={() => handlePresetClick(preset)}
                />
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default ColorPicker;
