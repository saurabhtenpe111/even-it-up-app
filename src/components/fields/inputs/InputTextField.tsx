
import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface InputTextFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  helpText?: string;
  floatLabel?: boolean;
  keyFilter?: "none" | "numeric" | "alpha" | "alphanumeric" | "custom";
  keyFilterPattern?: string;
  size?: "small" | "medium" | "large";
  invalid?: boolean;
  errorMessage?: string;
  filled?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  containerClassName?: string;
  textAlign?: 'left' | 'center' | 'right';
  labelPosition?: 'top' | 'left';
  labelWidth?: number;
  showBorder?: boolean;
  roundedCorners?: 'none' | 'small' | 'medium' | 'large';
  fieldSize?: 'small' | 'medium' | 'large';
  labelSize?: 'small' | 'medium' | 'large';
  customClass?: string;
}

export function InputTextField({
  id,
  label,
  helpText,
  floatLabel = false,
  keyFilter = "none",
  keyFilterPattern = "",
  size = "medium",
  invalid = false,
  errorMessage,
  filled = false,
  ariaLabel,
  ariaDescribedBy,
  className,
  containerClassName,
  disabled,
  required,
  value,
  defaultValue,
  onChange,
  onFocus,
  onBlur,
  textAlign = 'left',
  labelPosition = 'top',
  labelWidth = 30,
  showBorder = true,
  roundedCorners = 'medium',
  fieldSize = 'medium',
  labelSize = 'medium',
  customClass,
  style,
  ...props
}: InputTextFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState<string>(
    (value as string) || defaultValue as string || ""
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const helpTextId = ariaDescribedBy || `${id}-help`;
  const errorId = `${id}-error`;
  
  // Update internal state when the value prop changes
  useEffect(() => {
    if (value !== undefined) {
      setInputValue(value as string);
    }
  }, [value]);

  // Handle focus event
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  // Handle blur event
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  // Handle key filtering
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (props.onKeyDown) {
      props.onKeyDown(e);
    }

    // If no key filter or disabled, allow the key
    if (keyFilter === "none" || disabled) return;

    // Allow special keys like backspace, arrow keys, etc.
    const specialKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Escape", "Enter", "Home", "End"];
    if (specialKeys.includes(e.key)) return;

    // Allow copy/paste shortcuts
    if ((e.ctrlKey || e.metaKey) && (e.key === "c" || e.key === "v" || e.key === "x" || e.key === "a")) return;

    // Apply key filtering based on the selected filter
    let regex: RegExp;
    switch (keyFilter) {
      case "numeric":
        regex = /^\d$/;
        break;
      case "alpha":
        regex = /^[a-zA-Z]$/;
        break;
      case "alphanumeric":
        regex = /^[a-zA-Z0-9]$/;
        break;
      case "custom":
        try {
          regex = new RegExp(keyFilterPattern || ".");
        } catch (err) {
          // Default to allowing all if regex is invalid
          return;
        }
        break;
      default:
        return;
    }

    // Prevent key if it doesn't match the pattern
    if (!regex.test(e.key)) {
      e.preventDefault();
    }
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    if (onChange) {
      onChange(e);
    }
  };

  // Determine input size class
  const getSizeClass = () => {
    switch (fieldSize) {
      case 'small': return "h-8 text-xs px-2 py-1";
      case 'large': return "h-12 text-base px-4 py-3";
      default: return "h-10 text-sm px-3 py-2";
    }
  };

  // Get label size class
  const getLabelSizeClass = () => {
    switch (labelSize) {
      case 'small': return "text-xs";
      case 'large': return "text-lg";
      default: return "text-sm";
    }
  };

  // Get border radius class
  const getBorderRadiusClass = () => {
    switch (roundedCorners) {
      case 'none': return "rounded-none";
      case 'small': return "rounded-sm";
      case 'large': return "rounded-lg";
      default: return "rounded-md";
    }
  };

  // Get container layout styles
  const containerStyles: React.CSSProperties = {
    display: labelPosition === 'left' ? 'flex' : 'block',
    alignItems: labelPosition === 'left' ? 'center' : undefined,
    gap: labelPosition === 'left' ? '8px' : undefined,
  };
  
  // Get label styles
  const labelStyles: React.CSSProperties = {
    width: labelPosition === 'left' ? `${labelWidth}%` : 'auto',
    textAlign: textAlign as 'left' | 'center' | 'right',
  };
  
  // Get input styles
  const inputStyles: React.CSSProperties = {
    textAlign: textAlign as 'left' | 'center' | 'right',
    width: labelPosition === 'left' ? `${100 - labelWidth}%` : '100%',
    ...(style || {})
  };

  // Determine if label should float
  const shouldFloatLabel = floatLabel && (isFocused || inputValue);

  return (
    <div className={cn("relative", containerClassName)} style={containerStyles}>
      {label && !floatLabel && (
        <Label
          htmlFor={id}
          className={cn(
            getLabelSizeClass(),
            labelPosition === 'top' ? "mb-2 block" : "",
            invalid ? "text-red-500" : "",
            disabled ? "text-gray-400 cursor-not-allowed" : "",
            required ? "after:content-['*'] after:text-red-500 after:ml-0.5" : ""
          )}
          style={labelStyles}
        >
          {label}
        </Label>
      )}

      <div className="relative" style={{ width: labelPosition === 'left' ? `${100 - labelWidth}%` : '100%' }}>
        {label && floatLabel && (
          <Label
            htmlFor={id}
            className={cn(
              "absolute transition-all duration-200 pointer-events-none",
              getLabelSizeClass(),
              shouldFloatLabel
                ? "-top-2.5 left-2 text-xs bg-white px-1 z-10"
                : "top-1/2 left-3 -translate-y-1/2",
              isFocused ? "text-blue-600" : "text-gray-500",
              invalid ? "text-red-500" : "",
              disabled ? "text-gray-400 cursor-not-allowed" : "",
              required ? "after:content-['*'] after:text-red-500 after:ml-0.5" : ""
            )}
          >
            {label}
          </Label>
        )}

        <Input
          id={id}
          ref={inputRef}
          className={cn(
            getSizeClass(),
            getBorderRadiusClass(),
            filled ? "bg-gray-100" : "",
            !showBorder ? "border-0" : "",
            invalid ? "border-red-500 focus:ring-red-500" : "",
            floatLabel ? "pt-4 pb-2" : "",
            className,
            customClass
          )}
          value={value !== undefined ? value : inputValue}
          aria-invalid={invalid}
          aria-describedby={
            helpText ? helpTextId : invalid && errorMessage ? errorId : undefined
          }
          aria-label={ariaLabel || label || undefined}
          disabled={disabled}
          required={required}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          style={inputStyles}
          {...props}
        />
      </div>

      {helpText && !invalid && (
        <p id={helpTextId} className="text-xs text-gray-500 mt-1">
          {helpText}
        </p>
      )}

      {invalid && errorMessage && (
        <p id={errorId} className="text-xs text-red-500 mt-1">
          {errorMessage}
        </p>
      )}
    </div>
  );
}

export default InputTextField;
