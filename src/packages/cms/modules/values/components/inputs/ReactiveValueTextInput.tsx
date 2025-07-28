"use client";

import React, { useId, useRef, useEffect } from "react";
import { cn } from "@shared-ui/lib/utils";
import { Input } from "@shared-ui/shadcn/components/ui/input";
import { Textarea } from "@shared-ui/shadcn/components/ui/textarea";
import { PropertyMetaText } from "@cms/modules/properties/property.types";
import {
  usePropertyValue,
  usePropertyLabel,
  usePropertyPlaceholder,
  usePropertyTextUpdate,
} from "@cms/modules/values/hooks";
import { useCharacterLimit } from "@cms/modules/values/hooks/use-character-limit";
import { ValueInputMode } from "@cms/modules/values/types/value-input.types";

/**
 * 🔄 REACTIVE: ReactiveValueTextInput - Context-based text input component
 *
 * Updates automatically when:
 * - Property metadata changes
 * - Translation locale changes
 * - Value changes
 *
 * Must be used within PropertyValueProvider context.
 */
export interface ReactiveValueTextInputProps {
  /** Override default multiline behavior from property meta */
  customMultiline?: boolean;
  /** Override default max length from property meta */
  customMaxLength?: number;
  /** Override default placeholder text */
  customPlaceholder?: string;
  /** Whether to show floating label */
  floatingLabel?: boolean;
  /** Custom label text (overrides property name) */
  customLabel?: string;
  /** Whether to auto-resize textarea (multiline only) */
  autoResize?: boolean;
  /** Maximum visible height before scrolling (multiline only) */
  maxVisibleHeight?: number;
  /** Override disabled state */
  disabled?: boolean;
  /** Custom change handler (overrides context default) */
  onChange?: (textValue: string) => void;
  /** Additional class names */
  className?: string;
}

/**
 * 🔄 REACTIVE: Enhanced text input using PropertyValueContext
 */
export function ReactiveValueTextInput({
  customMultiline,
  customMaxLength,
  customPlaceholder,
  floatingLabel = false,
  customLabel,
  autoResize = true,
  maxVisibleHeight,
  disabled: externalDisabled,
  onChange: externalOnChange,
  className,
}: ReactiveValueTextInputProps): React.JSX.Element {
  const id = useId();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 🔄 REACTIVE: Get context values that update automatically
  const { currentProperty, currentValue, currentTranslation, mode } = usePropertyValue();
  const label = usePropertyLabel(customLabel);
  const placeholder = usePropertyPlaceholder(customPlaceholder);
  const updateTextValue = usePropertyTextUpdate();

  // 🔄 REACTIVE: Initialize with fallbacks for hook calls to satisfy React's rules
  const currentTextValue = currentProperty ? currentValue?.value_text?.[currentTranslation] || "" : "";

  // 🔄 REACTIVE: Extract metadata constraints from property with safe fallbacks
  const meta = currentProperty?.meta as PropertyMetaText | null;
  const isMultiline = customMultiline !== undefined ? customMultiline : meta?.multiline || false;
  const characterLimit = customMaxLength !== undefined ? customMaxLength : meta?.max || undefined;

  // Use character limit hook for controlled inputs (with guaranteed initialization)
  const {
    value: limitedValue,
    characterCount,
    handleChange,
    maxLength: limit,
  } = useCharacterLimit({
    maxLength: characterLimit,
    initialValue: currentTextValue,
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

  // Safety check for context initialization - after all hooks have been called
  if (!currentProperty) {
    return <div className="text-muted-foreground">No property available</div>;
  }

  // Determine if input should be disabled (external prop overrides context)
  const isDisabled = externalDisabled !== undefined ? externalDisabled : mode === ValueInputMode.PREVIEW;

  // Already called at the top of the component
  // const updateTextValue = usePropertyTextUpdate();

  // Handle changes and propagate to parent
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    // Don't propagate changes if disabled
    if (isDisabled) {
      return;
    }

    // Update character limit state
    handleChange(e);

    // Call external onChange if provided
    if (externalOnChange) {
      externalOnChange(e.target.value);
    } else {
      // Update value through context if no external handler
      updateTextValue(e.target.value);
    }
  };

  // Render multiline or single line input
  const renderInput = (): React.ReactNode => {
    if (isMultiline) {
      return (
        <Textarea
          id={id}
          ref={textareaRef}
          value={limitedValue}
          placeholder={placeholder}
          required={currentProperty.is_required}
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
          value={limitedValue}
          placeholder={placeholder}
          required={currentProperty.is_required}
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
  if (floatingLabel) {
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
          {currentProperty.is_required && <span className="ml-1 text-red-500">*</span>}
        </label>
      </div>
    );
  }

  return renderInput() as React.ReactElement;
}
