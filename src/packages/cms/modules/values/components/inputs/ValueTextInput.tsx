"use client";

import React, { useId, useRef, useEffect } from "react";
import { cn } from "@shared-ui/lib/utils";
import { Input } from "@shared-ui/shadcn/components/ui/input";
import { Textarea } from "@shared-ui/shadcn/components/ui/textarea";
import { PropertyMetaText } from "@cms/modules/properties/property.types";
import { useCharacterLimit } from "@cms/modules/values/hooks/use-character-limit";
import { ValueInputMode, ValueTextInputProps } from "@cms/modules/values/types/value-input.types";

/**
 * ValueTextInput - Enhanced text input component
 *
 * Features:
 * - Single/multiline support
 * - Character limit with counter
 * - Floating label option
 * - Auto-resizing textarea
 * - Preview/entry modes
 * - Full Property/Value object support
 */
export function ValueTextInput({
  property,
  value,
  defaultValue,
  placeholder,
  multiline,
  maxLength,
  floatingLabel = false,
  label,
  autoResize = true,
  maxVisibleHeight,
  mode = ValueInputMode.ENTRY,
  locale = "en",
  disabled = false,
  onChange,
  className,
}: ValueTextInputProps): React.JSX.Element {
  const id = useId();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Extract text value from Value object
  const currentTextValue = value?.value_text?.[locale] || "";
  const defaultTextValue = defaultValue?.value_text?.[locale] || "";

  // Extract metadata from property if not provided as props
  const meta = property.meta as PropertyMetaText | null;
  const isMultiline = multiline !== undefined ? multiline : meta?.multiline || false;
  const characterLimit = maxLength !== undefined ? maxLength : meta?.max || undefined;
  const inputPlaceholder = placeholder || `Enter ${property.name?.[locale] || property.code}`;

  // Use character limit hook for controlled inputs
  const {
    value: limitedValue,
    characterCount,
    handleChange,
    maxLength: limit,
  } = useCharacterLimit({
    maxLength: characterLimit,
    initialValue: currentTextValue || defaultTextValue,
  });

  // Handle auto-resize for textarea
  useEffect(() => {
    if (isMultiline && autoResize && textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = "auto";
      const newHeight = Math.min(textarea.scrollHeight, maxVisibleHeight ? maxVisibleHeight : Number.MAX_SAFE_INTEGER);
      textarea.style.height = `${newHeight}px`;
    }
  }, [limitedValue, isMultiline, autoResize, maxVisibleHeight]);

  // Determine if input should be disabled
  const isDisabled = disabled || mode === ValueInputMode.PREVIEW;

  // Handle changes and propagate to parent
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    // Don't propagate changes if disabled
    if (isDisabled) {
      return;
    }

    handleChange(e);

    // Create new Value object for parent component
    if (onChange) {
      const newValue = value
        ? { ...value }
        : {
            id: `temp-${Date.now()}`,
            property_id: property.id,
            record_id: "temp-record",
            value_text: null,
            value_number: null,
            value_bool: null,
            value_data: null,
            value_uuids: null,
            is_new: true,
          };

      newValue.value_text = {
        ...(newValue.value_text || {}),
        [locale]: e.target.value,
      };

      onChange(newValue);
    }
  };

  // Determine if we're using controlled or uncontrolled input
  const isControlled = mode === ValueInputMode.ENTRY && currentTextValue !== undefined;
  const inputDefaultValue = !isControlled ? defaultTextValue : undefined;

  // Render floating label wrapper if needed
  const renderInput = (): React.ReactNode => {
    if (isMultiline) {
      return (
        <Textarea
          id={id}
          ref={textareaRef}
          value={isControlled ? limitedValue : undefined}
          defaultValue={inputDefaultValue}
          placeholder={inputPlaceholder}
          required={property.is_required}
          disabled={isDisabled}
          maxLength={characterLimit}
          onChange={handleInputChange}
          className={cn(
            "resize-none",
            autoResize && "field-sizing-content min-h-0 py-1.75",
            maxVisibleHeight && "overflow-y-auto",
            floatingLabel && "pt-6",
            className,
          )}
          aria-describedby={characterLimit ? `${id}-limit` : undefined}
        />
      );
    }

    return (
      <div className="relative">
        <Input
          id={id}
          value={isControlled ? limitedValue : undefined}
          defaultValue={inputDefaultValue}
          placeholder={inputPlaceholder}
          required={property.is_required}
          disabled={isDisabled}
          maxLength={characterLimit}
          onChange={handleInputChange}
          className={cn(characterLimit && "pe-14", floatingLabel && "pt-6", className)}
          aria-describedby={characterLimit ? `${id}-limit` : undefined}
        />

        {characterLimit && (
          <div
            id={`${id}-limit`}
            className="text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-xs tabular-nums peer-disabled:opacity-50"
            aria-live="polite"
            role="status"
          >
            {characterCount}/{limit}
          </div>
        )}
      </div>
    );
  };

  // If using floating label, wrap input in a container
  if (floatingLabel && label) {
    return (
      <div className="relative">
        {renderInput()}
        <label
          htmlFor={id}
          className={cn(
            "absolute top-2 left-3 z-10 origin-[0] -translate-y-1 scale-75 transform text-sm text-gray-500 duration-300",
            "peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-1 peer-focus:scale-75",
          )}
        >
          {label}
          {property.is_required && <span className="ml-1 text-red-500">*</span>}
        </label>
      </div>
    );
  }

  return renderInput() as React.ReactElement;
}
