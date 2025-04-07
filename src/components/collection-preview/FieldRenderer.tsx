
import React from "react";
import InputTextField from "../fields/inputs/InputTextField";
import PasswordInputField from "../fields/inputs/PasswordInputField";
import NumberInputField from "../fields/inputs/NumberInputField";
import { Textarea } from "@/components/ui/textarea";
import MarkdownEditorField from "../fields/inputs/MarkdownEditorField";
import WysiwygEditorField from "../fields/inputs/WysiwygEditorField";
import BlockEditorField from "../fields/inputs/BlockEditorField";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { 
  Select, 
  SelectContent, 
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import ColorPickerField from "../fields/inputs/ColorPickerField";
import SlugInputField from "../fields/inputs/SlugInputField";
import TagsInputField from "../fields/inputs/TagsInputField";
import MaskInputField from "../fields/inputs/MaskInputField";
import OTPInputField from "../fields/inputs/OTPInputField";
import AutocompleteInputField from "../fields/inputs/AutocompleteInputField";
import { cn } from "@/lib/utils";

export interface FieldRendererProps {
  field: any;
  formData: Record<string, any>;
  titleField?: string | null;
  onInputChange: (fieldId: string, value: any) => void;
  errors?: Record<string, string[]>;
}

export const FieldRenderer = ({ field, formData, titleField, onInputChange, errors }: FieldRendererProps) => {
  const fieldId = field.id || field.apiId || field.name;
  const fieldName = field.name || "Field";
  const value = formData?.[fieldId] !== undefined ? formData[fieldId] : "";
  const placeholder = field.ui_options?.placeholder || `Enter ${fieldName}...`;
  const helpText = field.helpText || field.ui_options?.help_text;
  const required = field.required || false;
  const hasError = errors && errors[fieldId]?.length > 0;
  const errorMessage = errors && errors[fieldId]?.join(", ");
  
  // Extract appearance settings
  const appearance = field.appearance || {};
  const {
    textAlign,
    labelPosition,
    labelWidth,
    floatLabel,
    filled,
    showBorder,
    showBackground,
    roundedCorners,
    fieldSize,
    labelSize,
    uiVariant,
    customClass,
    colors = {}
  } = appearance;
  
  // Extract advanced settings
  const advanced = field.advanced || {};
  
  // Create a className that includes any error styling
  const fieldClassName = cn(
    customClass || "",
    "w-full",
    hasError && "has-error"
  );
  
  switch (field.type) {
    case "text":
      return (
        <InputTextField
          id={fieldId}
          label={fieldName}
          value={value || ""}
          onChange={(newValue) => onInputChange(fieldId, newValue)}
          placeholder={placeholder}
          required={required}
          helpText={hasError ? errorMessage : helpText}
          keyFilter={advanced.keyFilter || "none"}
          floatLabel={floatLabel || false}
          filled={filled || false}
          textAlign={textAlign || "left"}
          labelPosition={labelPosition || "top"}
          labelWidth={labelWidth || 30}
          showBorder={showBorder !== false}
          roundedCorners={roundedCorners || "medium"}
          fieldSize={fieldSize || "medium"}
          labelSize={labelSize || "medium"}
          customClass={fieldClassName}
          colors={colors}
        />
      );

    case "number":
      return (
        <NumberInputField
          id={fieldId}
          label={fieldName}
          value={value || 0}
          onChange={(newValue) => onInputChange(fieldId, newValue)}
          min={field.min}
          max={field.max}
          placeholder={placeholder}
          required={required}
          helpText={hasError ? errorMessage : helpText}
          floatLabel={floatLabel || false}
          filled={filled || false}
          showButtons={advanced.showButtons || false}
          buttonLayout={advanced.buttonLayout || "horizontal"}
          prefix={advanced.prefix || ""}
          suffix={advanced.suffix || ""}
          textAlign={textAlign || "left"}
          labelPosition={labelPosition || "top"}
          labelWidth={labelWidth || 30}
          showBorder={showBorder !== false}
          roundedCorners={roundedCorners || "medium"}
          fieldSize={fieldSize || "medium"}
          labelSize={labelSize || "medium"}
          customClass={fieldClassName}
          colors={colors}
        />
      );

    case "password":
      return (
        <PasswordInputField
          id={fieldId}
          label={fieldName}
          value={value || ""}
          onChange={(newValue) => onInputChange(fieldId, newValue)}
          placeholder={placeholder}
          required={required}
          helpText={hasError ? errorMessage : helpText}
          floatLabel={floatLabel || false}
          filled={filled || false}
          textAlign={textAlign || "left"}
          labelPosition={labelPosition || "top"}
          labelWidth={labelWidth || 30}
          showBorder={showBorder !== false}
          roundedCorners={roundedCorners || "medium"}
          fieldSize={fieldSize || "medium"}
          labelSize={labelSize || "medium"}
          customClass={fieldClassName}
          colors={colors}
        />
      );

    case "textarea":
      return (
        <div className={fieldClassName}>
          <Label htmlFor={fieldId}>{fieldName}</Label>
          <Textarea
            id={fieldId}
            value={value || ""}
            onChange={(e) => onInputChange(fieldId, e.target.value)}
            placeholder={placeholder}
            required={required}
            rows={field.rows || 3}
          />
          {(helpText || hasError) && (
            <p className={cn("text-sm mt-1", hasError ? "text-destructive" : "text-gray-500")}>
              {hasError ? errorMessage : helpText}
            </p>
          )}
        </div>
      );

    case "markdown":
      return (
        <MarkdownEditorField
          id={fieldId}
          label={fieldName}
          value={value || ""}
          onChange={(newValue) => onInputChange(fieldId, newValue)}
          placeholder={placeholder}
          required={required}
          helpText={hasError ? errorMessage : helpText}
          rows={field.rows || 3}
          className={fieldClassName}
        />
      );

    case "wysiwyg":
      return (
        <WysiwygEditorField
          id={fieldId}
          label={fieldName}
          value={value || ""}
          onChange={(newValue) => onInputChange(fieldId, newValue)}
          placeholder={placeholder}
          required={required}
          helpText={hasError ? errorMessage : helpText}
          minHeight={field.minHeight || "200px"}
          className={fieldClassName}
        />
      );

    case "blockeditor":
      return (
        <BlockEditorField
          id={fieldId}
          label={fieldName}
          value={value || ""}
          onChange={(newValue) => onInputChange(fieldId, newValue)}
          placeholder={placeholder}
          required={required}
          helpText={hasError ? errorMessage : helpText}
          minHeight={field.minHeight || "200px"}
          className={fieldClassName}
        />
      );

    case "file":
      return (
        <div className={fieldClassName}>
          <Label htmlFor={fieldId}>{fieldName}</Label>
          <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md border-gray-300 bg-gray-50 mt-2">
            <Button variant="outline" type="button" onClick={() => console.log("File upload clicked")}>
              <Upload className="mr-2 h-4 w-4" />
              Upload file
            </Button>
            <p className="mt-2 text-xs text-gray-500">Drag and drop or click to upload</p>
          </div>
          {(helpText || hasError) && (
            <p className={cn("text-sm mt-1", hasError ? "text-destructive" : "text-gray-500")}>
              {hasError ? errorMessage : helpText}
            </p>
          )}
        </div>
      );

    case "image":
      return (
        <div className={fieldClassName}>
          <Label htmlFor={fieldId}>{fieldName}</Label>
          <div className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-md border-gray-300 bg-gray-50 mt-2">
            <Button variant="outline" type="button" onClick={() => console.log("Image upload clicked")}>
              <Upload className="mr-2 h-4 w-4" />
              Upload image
            </Button>
            <p className="mt-2 text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
          </div>
          {(helpText || hasError) && (
            <p className={cn("text-sm mt-1", hasError ? "text-destructive" : "text-gray-500")}>
              {hasError ? errorMessage : helpText}
            </p>
          )}
        </div>
      );

    case "date":
      return (
        <div className={fieldClassName}>
          <Label htmlFor={fieldId}>{fieldName}</Label>
          <div className="border rounded-md p-1 mt-2">
            <Calendar
              mode="single"
              selected={value ? new Date(value) : undefined}
              onSelect={(date) => onInputChange(fieldId, date?.toISOString() || "")}
            />
          </div>
          {(helpText || hasError) && (
            <p className={cn("text-sm mt-1", hasError ? "text-destructive" : "text-gray-500")}>
              {hasError ? errorMessage : helpText}
            </p>
          )}
        </div>
      );

    case "select":
      return (
        <div className={fieldClassName}>
          <Label htmlFor={fieldId}>{fieldName}</Label>
          <Select
            value={value || ""}
            onValueChange={(newValue) => onInputChange(fieldId, newValue)}
          >
            <SelectTrigger>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option: any) => (
                <SelectItem key={option.value || option} value={option.value || option}>
                  {option.label || option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {(helpText || hasError) && (
            <p className={cn("text-sm mt-1", hasError ? "text-destructive" : "text-gray-500")}>
              {hasError ? errorMessage : helpText}
            </p>
          )}
        </div>
      );

    case "multiselect":
      return (
        <div className={fieldClassName}>
          <Label htmlFor={fieldId}>{fieldName}</Label>
          <div className="border rounded-md p-3 mt-2 max-h-60 overflow-y-auto">
            {field.options?.map((option: any) => {
              const optionValue = option.value || option;
              const optionLabel = option.label || option;
              const isSelected = Array.isArray(value) && value.includes(optionValue);
              
              return (
                <div key={optionValue} className="flex items-center space-x-2 py-1">
                  <Checkbox
                    id={`${fieldId}-${optionValue}`}
                    checked={isSelected}
                    onCheckedChange={(checked) => {
                      let newValue = [...(Array.isArray(value) ? value : [])];
                      if (checked) {
                        if (!newValue.includes(optionValue)) {
                          newValue.push(optionValue);
                        }
                      } else {
                        newValue = newValue.filter((v) => v !== optionValue);
                      }
                      onInputChange(fieldId, newValue);
                    }}
                  />
                  <Label htmlFor={`${fieldId}-${optionValue}`}>{optionLabel}</Label>
                </div>
              );
            })}
          </div>
          {(helpText || hasError) && (
            <p className={cn("text-sm mt-1", hasError ? "text-destructive" : "text-gray-500")}>
              {hasError ? errorMessage : helpText}
            </p>
          )}
        </div>
      );

    case "toggle":
      return (
        <div className={fieldClassName}>
          <div className="flex items-center space-x-2">
            <Switch
              id={fieldId}
              checked={!!value}
              onCheckedChange={(checked) => onInputChange(fieldId, checked)}
            />
            <Label htmlFor={fieldId}>{fieldName}</Label>
          </div>
          {(helpText || hasError) && (
            <p className={cn("text-sm mt-1", hasError ? "text-destructive" : "text-gray-500")}>
              {hasError ? errorMessage : helpText}
            </p>
          )}
        </div>
      );

    case "checkbox":
      return (
        <div className={fieldClassName}>
          <Label className="mb-2 block">{fieldName}</Label>
          <div className="space-y-2">
            {field.options?.map((option: any) => {
              const optionValue = option.value || option;
              const optionLabel = option.label || option;
              const isChecked = Array.isArray(value) ? value.includes(optionValue) : false;
              
              return (
                <div key={optionValue} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${fieldId}-${optionValue}`}
                    checked={isChecked}
                    onCheckedChange={(checked) => {
                      let newValue = [...(Array.isArray(value) ? value : [])];
                      if (checked) {
                        if (!newValue.includes(optionValue)) {
                          newValue.push(optionValue);
                        }
                      } else {
                        newValue = newValue.filter((v) => v !== optionValue);
                      }
                      onInputChange(fieldId, newValue);
                    }}
                  />
                  <Label htmlFor={`${fieldId}-${optionValue}`}>{optionLabel}</Label>
                </div>
              );
            })}
          </div>
          {(helpText || hasError) && (
            <p className={cn("text-sm mt-1", hasError ? "text-destructive" : "text-gray-500")}>
              {hasError ? errorMessage : helpText}
            </p>
          )}
        </div>
      );

    case "radio":
      return (
        <div className={fieldClassName}>
          <Label className="mb-2 block">{fieldName}</Label>
          <RadioGroup
            value={value || ""}
            onValueChange={(newValue) => onInputChange(fieldId, newValue)}
          >
            {field.options?.map((option: any) => {
              const optionValue = option.value || option;
              const optionLabel = option.label || option;
              
              return (
                <div key={optionValue} className="flex items-center space-x-2">
                  <RadioGroupItem value={optionValue} id={`${fieldId}-${optionValue}`} />
                  <Label htmlFor={`${fieldId}-${optionValue}`}>{optionLabel}</Label>
                </div>
              );
            })}
          </RadioGroup>
          {(helpText || hasError) && (
            <p className={cn("text-sm mt-1", hasError ? "text-destructive" : "text-gray-500")}>
              {hasError ? errorMessage : helpText}
            </p>
          )}
        </div>
      );

    case "color":
      return (
        <ColorPickerField
          id={fieldId}
          label={fieldName}
          value={value || ""}
          onChange={(newValue) => onInputChange(fieldId, newValue)}
          helpText={hasError ? errorMessage : helpText}
          className={fieldClassName}
        />
      );

    case "slug":
      return (
        <SlugInputField
          id={fieldId}
          label={fieldName}
          value={value || ""}
          onChange={(newValue) => onInputChange(fieldId, newValue)}
          placeholder={placeholder}
          required={required}
          helpText={hasError ? errorMessage : helpText}
          prefix={field.prefix || ""}
          suffix={field.suffix || ""}
          className={fieldClassName}
        />
      );

    case "tags":
      return (
        <TagsInputField
          id={fieldId}
          label={fieldName}
          value={value || []}
          onChange={(newValue) => onInputChange(fieldId, newValue)}
          placeholder={placeholder}
          required={required}
          helpText={hasError ? errorMessage : helpText}
          maxTags={field.maxTags || 10}
          className={fieldClassName}
        />
      );

    case "mask":
      return (
        <MaskInputField
          id={fieldId}
          label={fieldName}
          value={value || ""}
          onChange={(newValue) => onInputChange(fieldId, newValue)}
          placeholder={placeholder}
          required={required}
          helpText={hasError ? errorMessage : helpText}
          mask={field.mask || ""}
          className={fieldClassName}
        />
      );

    case "otp":
      return (
        <OTPInputField
          id={fieldId}
          label={fieldName}
          value={value || ""}
          onChange={(newValue) => onInputChange(fieldId, newValue)}
          length={field.length || 6}
          helpText={hasError ? errorMessage : helpText}
          className={fieldClassName}
        />
      );

    case "autocomplete":
      return (
        <AutocompleteInputField
          id={fieldId}
          label={fieldName}
          value={value || ""}
          onChange={(newValue) => onInputChange(fieldId, newValue)}
          placeholder={placeholder}
          required={required}
          helpText={hasError ? errorMessage : helpText}
          options={field.options || []}
          className={fieldClassName}
        />
      );

    default:
      return (
        <div>
          <p className="text-sm text-gray-500">Field type '{field.type}' not supported in preview</p>
        </div>
      );
  }
};

export default FieldRenderer;
