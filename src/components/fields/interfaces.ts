
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
}
