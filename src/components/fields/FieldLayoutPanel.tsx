
import React, { useState } from 'react';
import DateCalendarField from './inputs/DateCalendarField';

export function FieldLayoutPanel() {
  const [date, setDate] = useState<Date>(new Date());
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Field Layout Examples</h2>
      <p className="text-gray-500 mb-8">View and test different field layout configurations</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-8">
          <div className="p-4 border rounded-md">
            <h3 className="text-sm font-medium mb-3">1. Basic Date Field</h3>
            <DateCalendarField 
              id="basic-date"
              value={date} 
              onChange={setDate}
              label="Select a date"
            />
          </div>
          
          <div className="p-4 border rounded-md">
            <h3 className="text-sm font-medium mb-3">2. Date Format</h3>
            <DateCalendarField 
              id="date-format-1"
              value={date} 
              onChange={setDate}
              label="Short Date Format"
              dateFormat="P"
            />
            <div className="mt-4">
              <DateCalendarField 
                id="date-format-2"
                value={date} 
                onChange={setDate}
                label="Long Date Format"
                dateFormat="PPP"
              />
            </div>
          </div>
          
          <div className="p-4 border rounded-md">
            <h3 className="text-sm font-medium mb-3">3. Selection Types</h3>
            <DateCalendarField 
              id="selection-type-1"
              value={date} 
              onChange={setDate}
              label="Multiple Selection"
              allowMultipleSelection={true}
            />
            <div className="mt-4">
              <DateCalendarField 
                id="selection-type-2"
                value={date} 
                onChange={setDate}
                label="Range Selection"
                allowRangeSelection={true}
              />
            </div>
          </div>
          
          <div className="p-4 border rounded-md">
            <h3 className="text-sm font-medium mb-3">4. View Types</h3>
            <DateCalendarField 
              id="view-type-1"
              value={date} 
              onChange={setDate}
              label="Month Picker Only"
              monthPickerOnly={true}
            />
            <div className="mt-4">
              <DateCalendarField 
                id="view-type-2"
                value={date} 
                onChange={setDate}
                label="Year Picker Only"
                yearPickerOnly={true}
              />
            </div>
          </div>
          
          <div className="p-4 border rounded-md">
            <h3 className="text-sm font-medium mb-3">5. Additional Features</h3>
            <DateCalendarField 
              id="features-1"
              value={date} 
              onChange={setDate}
              label="With Button Bar"
              showButtonBar={true}
            />
            <div className="mt-4">
              <DateCalendarField 
                id="features-2"
                value={date} 
                onChange={setDate}
                label="With Time Picker"
                includeTimePicker={true}
              />
            </div>
            <div className="mt-4">
              <DateCalendarField 
                id="features-3"
                value={date} 
                onChange={setDate}
                label="Multiple Months View"
                showMultipleMonths={true}
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-8">
          <div className="p-4 border rounded-md">
            <h3 className="text-sm font-medium mb-3">6. Input Styles</h3>
            <DateCalendarField 
              id="style-1"
              value={date} 
              onChange={setDate}
              label="Floating Label"
              floatingLabel={true}
            />
            <div className="mt-4">
              <DateCalendarField 
                id="style-2"
                value={date} 
                onChange={setDate}
                label="Invalid State"
                invalid={true}
              />
            </div>
            <div className="mt-4">
              <DateCalendarField 
                id="style-3"
                value={date} 
                onChange={setDate}
                label="Disabled State"
                disabled={true}
              />
            </div>
          </div>
          
          <div className="p-4 border rounded-md">
            <h3 className="text-sm font-medium mb-3">7. Inline Calendar</h3>
            <DateCalendarField 
              id="inline-calendar"
              value={date} 
              onChange={setDate}
              label="Embedded Calendar"
              inlineMode={true}
            />
          </div>
          
          <div className="p-4 border rounded-md">
            <h3 className="text-sm font-medium mb-3">8. Help Text & Required</h3>
            <DateCalendarField 
              id="help-required"
              value={date} 
              onChange={setDate}
              label="Birthday"
              required={true}
              helpText="Please select your date of birth from the calendar"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default FieldLayoutPanel;
