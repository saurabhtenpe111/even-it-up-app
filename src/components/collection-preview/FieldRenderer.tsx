import React from "react";
import InputTextField from "../fields/inputs/InputTextField";
import PasswordInputField from "../fields/inputs/PasswordInputField";
import NumberInputField from "../fields/inputs/NumberInputField";
import TextareaField from "../fields/inputs/TextareaField";
import MarkdownEditorField from "../fields/inputs/MarkdownEditorField";
import WysiwygEditorField from "../fields/inputs/WysiwygEditorField";
import BlockEditorField from "../fields/inputs/BlockEditorField";
import FileUploadField from "../fields/inputs/FileUploadField";
import ImageUploadField from "../fields/inputs/ImageUploadField";
import DatePickerField from "../fields/inputs/DatePickerField";
import SelectField from "../fields/inputs/SelectField";
import MultiSelectField from "../fields/inputs/MultiSelectField";
import ToggleField from "../fields/inputs/ToggleField";
import CheckboxGroupField from "../fields/inputs/CheckboxGroupField";
import RadioGroupField from "../fields/inputs/RadioGroupField";
import ColorPickerField from "../fields/inputs/ColorPickerField";
import SlugInputField from "../fields/inputs/SlugInputField";
import TagsInputField from "../fields/inputs/TagsInputField";
import MaskInputField from "../fields/inputs/MaskInputField";
import OTPInputField from "../fields/inputs/OTPInputField";
import AutocompleteInputField from "../fields/inputs/AutocompleteInputField";
import { cn } from "@/lib/utils";

interface FieldRendererProps {
  field: any;
  value: any;
  onChange: (fieldId: string, value: any) => void;
  errors?: Record<string, string[]>;
}

export const FieldRenderer = ({ field, value, onChange, errors }: FieldRendererProps) => {
  const fieldId = field.id || field.apiId || field.name;
  const fieldName = field.name || "Field";
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
          onChange={(newValue) => onChange(fieldId, newValue)}
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
          onChange={(newValue) => onChange(fieldId, newValue)}
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
          onChange={(newValue) => onChange(fieldId, newValue)}
          placeholder={placeholder}
          required={required}
          helpText={hasError ? errorMessage : helpText}
          showToggle={advanced.showToggle || true}
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
        <TextareaField
          id={fieldId}
          label={fieldName}
          value={value || ""}
          onChange={(newValue) => onChange(fieldId, newValue)}
          placeholder={placeholder}
          required={required}
          helpText={hasError ? errorMessage : helpText}
          rows={field.rows || 3}
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

    case "markdown":
      return (
        <MarkdownEditorField
          id={fieldId}
          label={fieldName}
          value={value || ""}
          onChange={(newValue) => onChange(fieldId, newValue)}
          placeholder={placeholder}
          required={required}
          helpText={hasError ? errorMessage : helpText}
          rows={field.rows || 3}
          customClass={fieldClassName}
        />
      );

    case "wysiwyg":
      return (
        <WysiwygEditorField
          id={fieldId}
          label={fieldName}
          value={value || ""}
          onChange={(newValue) => onChange(fieldId, newValue)}
          placeholder={placeholder}
          required={required}
          helpText={hasError ? errorMessage : helpText}
          minHeight={field.minHeight || "200px"}
          customClass={fieldClassName}
        />
      );

    case "blockeditor":
      return (
        <BlockEditorField
          id={fieldId}
          label={fieldName}
          value={value || ""}
          onChange={(newValue) => onChange(fieldId, newValue)}
          placeholder={placeholder}
          required={required}
          helpText={hasError ? errorMessage : helpText}
          minHeight={field.minHeight || "200px"}
          customClass={fieldClassName}
        />
      );

    case "file":
      return (
        <FileUploadField
          id={fieldId}
          label={fieldName}
          value={value || ""}
          onChange={(newValue) => onChange(fieldId, newValue)}
          placeholder={placeholder}
          required={required}
          helpText={hasError ? errorMessage : helpText}
          customClass={fieldClassName}
        />
      );

    case "image":
      return (
        <ImageUploadField
          id={fieldId}
          label={fieldName}
          value={value || ""}
          onChange={(newValue) => onChange(fieldId, newValue)}
          placeholder={placeholder}
          required={required}
          helpText={hasError ? errorMessage : helpText}
          customClass={fieldClassName}
        />
      );

    case "date":
      return (
        <DatePickerField
          id={fieldId}
          label={fieldName}
          value={value || ""}
          onChange={(newValue) => onChange(fieldId, newValue)}
          placeholder={placeholder}
          required={required}
          helpText={hasError ? errorMessage : helpText}
          customClass={fieldClassName}
        />
      );

    case "select":
      return (
        <SelectField
          id={fieldId}
          label={fieldName}
          value={value || ""}
          onChange={(newValue) => onChange(fieldId, newValue)}
          placeholder={placeholder}
          required={required}
          helpText={hasError ? errorMessage : helpText}
          options={field.options || []}
          customClass={fieldClassName}
        />
      );

    case "multiselect":
      return (
        <MultiSelectField
          id={fieldId}
          label={fieldName}
          value={value || []}
          onChange={(newValue) => onChange(fieldId, newValue)}
          placeholder={placeholder}
          required={required}
          helpText={hasError ? errorMessage : helpText}
          options={field.options || []}
          customClass={fieldClassName}
        />
      );

    case "toggle":
      return (
        <ToggleField
          id={fieldId}
          label={fieldName}
          value={value || false}
          onChange={(newValue) => onChange(fieldId, newValue)}
          helpText={hasError ? errorMessage : helpText}
          customClass={fieldClassName}
        />
      );

    case "checkbox":
      return (
        <CheckboxGroupField
          id={fieldId}
          label={fieldName}
          value={value || []}
          onChange={(newValue) => onChange(fieldId, newValue)}
          options={field.options || []}
          helpText={hasError ? errorMessage : helpText}
          customClass={fieldClassName}
        />
      );

    case "radio":
      return (
        <RadioGroupField
          id={fieldId}
          label={fieldName}
          value={value || ""}
          onChange={(newValue) => onChange(fieldId, newValue)}
          options={field.options || []}
          helpText={hasError ? errorMessage : helpText}
          customClass={fieldClassName}
        />
      );

    case "color":
      return (
        <ColorPickerField
          id={fieldId}
          label={fieldName}
          value={value || ""}
          onChange={(newValue) => onChange(fieldId, newValue)}
          helpText={hasError ? errorMessage : helpText}
          customClass={fieldClassName}
        />
      );

    case "slug":
      return (
        <SlugInputField
          id={fieldId}
          label={fieldName}
          value={value || ""}
          onChange={(newValue) => onChange(fieldId, newValue)}
          placeholder={placeholder}
          required={required}
          helpText={hasError ? errorMessage : helpText}
          prefix={field.prefix || ""}
          suffix={field.suffix || ""}
          customClass={fieldClassName}
        />
      );

    case "tags":
      return (
        <TagsInputField
          id={fieldId}
          label={fieldName}
          value={value || []}
          onChange={(newValue) => onChange(fieldId, newValue)}
          placeholder={placeholder}
          required={required}
          helpText={hasError ? errorMessage : helpText}
          maxTags={field.maxTags || 10}
          customClass={fieldClassName}
        />
      );

    case "mask":
      return (
        <MaskInputField
          id={fieldId}
          label={fieldName}
          value={value || ""}
          onChange={(newValue) => onChange(fieldId, newValue)}
          placeholder={placeholder}
          required={required}
          helpText={hasError ? errorMessage : helpText}
          mask={field.mask || ""}
          customClass={fieldClassName}
        />
      );

    case "otp":
      return (
        <OTPInputField
          id={fieldId}
          label={fieldName}
          value={value || ""}
          onChange={(newValue) => onChange(fieldId, newValue)}
          length={field.length || 6}
          helpText={hasError ? errorMessage : helpText}
          customClass={fieldClassName}
        />
      );

    case "autocomplete":
      return (
        <AutocompleteInputField
          id={fieldId}
          label={fieldName}
          value={value || ""}
          onChange={(newValue) => onChange(fieldId, newValue)}
          placeholder={placeholder}
          required={required}
          helpText={hasError ? errorMessage : helpText}
          options={field.options || []}
          customClass={fieldClassName}
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
