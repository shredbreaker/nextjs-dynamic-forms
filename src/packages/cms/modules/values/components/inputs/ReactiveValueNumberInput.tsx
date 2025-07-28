"use client";

import React, { useCallback } from "react";
import { cn } from "@shared-ui/lib/utils";
import { Input } from "@shared-ui/shadcn/components/ui/input";
import { PropertyMetaNumber } from "@cms/modules/properties/property.types";
import { usePropertyValue, usePropertyPlaceholder } from "@cms/modules/values/hooks";
import { ValueInputMode } from "@cms/modules/values/types/value-input.types";

/**
 * 🔄 REACTIVE: ReactiveValueNumberInput - Context-based number input component
 *
 * Updates automatically when:
 * - Property metadata changes
 * - Translation locale changes
 * - Value changes
 *
 * Must be used within PropertyValueProvider context.
 */
export interface ReactiveValueNumberInputProps {
  /** Override default min value from property meta */
  customMin?: number;
  /** Override default max value from property meta */
  customMax?: number;
  /** Override default integer constraint from property meta */
  customInteger?: boolean;
  /** Override default placeholder text */
  customPlaceholder?: string;
  /** Override disabled state */
  disabled?: boolean;
  /** Number formatting options */
  formatting?: {
    showThousandsSeparator?: boolean;
  };
  /** Custom change handler (overrides context default) */
  onChange?: (numberValue: number | null) => void;
  /** Additional class names */
  className?: string;
}

/**
 * 🔄 REACTIVE: Enhanced number input using PropertyValueContext
 */
export function ReactiveValueNumberInput({
  customMin,
  customMax,
  customInteger,
  customPlaceholder,
  disabled: externalDisabled,
  formatting,
  onChange: externalOnChange,
  className,
}: ReactiveValueNumberInputProps): React.JSX.Element {
  // 🔄 REACTIVE: Get context values that update automatically
  const { currentProperty, currentValue, mode } = usePropertyValue();
  const placeholder = usePropertyPlaceholder(customPlaceholder);

  // 🔄 REACTIVE: Extract metadata constraints from property with safe fallbacks
  const meta = currentProperty?.meta as PropertyMetaNumber | null;
  const min = customMin !== undefined ? customMin : (meta?.min ?? undefined);
  const max = customMax !== undefined ? customMax : (meta?.max ?? undefined);
  const isInteger = customInteger !== undefined ? customInteger : (meta?.integer ?? false);
  const isRequired = currentProperty?.is_required ?? false;

  // 🔄 REACTIVE: Get current number value
  const currentNumber = currentValue?.value_number ?? null;
  const displayValue = currentNumber !== null ? String(currentNumber) : "";

  // Determine if input should be disabled (external prop overrides context)
  const isDisabled = externalDisabled !== undefined ? externalDisabled : false;

  // Clamp number to min/max constraints
  const clampNumber = useCallback(
    (num: number): number => {
      let result = num;
      if (min !== undefined && result < min) result = min;
      if (max !== undefined && result > max) result = max;
      if (isInteger) result = Math.round(result);
      return result;
    },
    [min, max, isInteger],
  );

  // Handle number change
  const handleChange = useCallback(
    (inputValue: string) => {
      if (isDisabled) return;

      // Handle empty input (valid case)
      if (inputValue === "") {
        // Call external onChange if provided
        if (externalOnChange) {
          externalOnChange(null);
        }
        return;
      }

      // Parse number and validate
      const parsed = parseFloat(inputValue);
      if (isNaN(parsed)) {
        // Don't update for invalid numbers
        return;
      }

      // Apply constraints
      const clampedNumber = clampNumber(parsed);

      // Call external onChange if provided
      if (externalOnChange) {
        externalOnChange(clampedNumber);
      }
    },
    [isDisabled, externalOnChange, clampNumber],
  );

  // Safety check for context initialization - after all hooks have been called
  if (!currentProperty) {
    return <div className="text-muted-foreground">No property available</div>;
  }

  return (
    <div className="space-y-1">
      <Input
        type="number"
        placeholder={placeholder}
        disabled={isDisabled}
        min={min}
        max={max}
        step={isInteger ? 1 : 0.01}
        defaultValue={displayValue}
        className={cn(
          "w-full",
          isRequired && currentNumber === null && "ring-red-200",
          isDisabled && "cursor-not-allowed opacity-50",
          mode === ValueInputMode.PREVIEW && "border-blue-200",
          className,
        )}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          if (!isDisabled) {
            handleChange(e.target.value);
          }
        }}
      />
      {(min !== undefined || max !== undefined) && (
        <div className="text-xs text-gray-500">
          {min !== undefined && max !== undefined && `Range: ${min} - ${max}`}
          {min !== undefined && max === undefined && `Min: ${min}`}
          {min === undefined && max !== undefined && `Max: ${max}`}
          {isInteger && " (whole numbers only)"}
        </div>
      )}
      {formatting?.showThousandsSeparator && currentNumber !== null && (
        <div className="text-xs text-gray-500">Formatted: {currentNumber.toLocaleString()}</div>
      )}
    </div>
  );
}
