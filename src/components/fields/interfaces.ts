
export interface FieldAppearancePanelProps {
  fieldType: string | null;
  initialData?: any;
  onUpdate: (data: any) => void;
  form?: any;
}

export interface DateCalendarFieldProps {
  id: string;
  label: string;
  value: Date | null;
  onChange: (date: Date) => void;
  required?: boolean;
  helpText?: string;
  disabled?: boolean;
  dateFormat?: string;
  allowMultipleSelection?: boolean;
  allowRangeSelection?: boolean;
  monthPickerOnly?: boolean;
  yearPickerOnly?: boolean;
  showButtonBar?: boolean;
  includeTimePicker?: boolean;
  showMultipleMonths?: boolean;
  floatingLabel?: boolean;
  invalid?: boolean;
  inlineMode?: boolean;
}

export interface FieldValidationPanelProps {
  fieldType: string | null;
  initialData?: any;
  onUpdate: (data: any) => void;
}
