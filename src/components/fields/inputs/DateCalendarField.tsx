
import React, { useState, useEffect } from 'react';
import { format, isValid, parse } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CalendarIcon, X } from 'lucide-react';
import { DateCalendarFieldProps } from '../interfaces';

export function DateCalendarField({
  id,
  label,
  value,
  onChange,
  required = false,
  helpText,
  disabled = false
}: DateCalendarFieldProps) {
  const [date, setDate] = useState<Date | null>(value || null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  
  // Update internal state when external value changes
  useEffect(() => {
    setDate(value);
  }, [value]);

  // Handle date selection
  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      onChange(selectedDate);
      setCalendarOpen(false);
    }
  };

  // Clear the date
  const handleClear = () => {
    setDate(null);
    onChange(new Date(0)); // Sending a default date since the interface requires a Date
    setCalendarOpen(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="block text-sm font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      </div>
      
      <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            disabled={disabled}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date && isValid(date) ? format(date, 'PP') : <span>Pick a date</span>}
            {date && (
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date || undefined}
            onSelect={handleSelect}
            initialFocus
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
      
      {helpText && <p className="text-xs text-gray-500">{helpText}</p>}
    </div>
  );
}

export default DateCalendarField;
