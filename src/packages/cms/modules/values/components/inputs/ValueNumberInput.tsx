"use client";

import React, { useCallback } from "react";
import { cn } from "@shared-ui/lib/utils";
import { Input } from "@shared-ui/shadcn/components/ui/input";
import { PropertyMetaNumber } from "@cms/modules/properties/property.types";
import { ValueNumberInputProps, ValueInputMode } from "@cms/modules/values/types/value-input.types";
import { Value } from "@cms/modules/values/value.types";

export function ValueNumberInput({
  property,
  value,
  mode,
  locale = "en",
  disabled = false,
  onChange,
  formatting,
}: ValueNumberInputProps): React.JSX.Element {
  // Extract meta information
  const meta = property.meta as PropertyMetaNumber | null;
  const min = meta?.min ?? undefined;
  const max = meta?.max ?? undefined;
  const isInteger = meta?.integer ?? false;
  const isRequired = property.is_required;
  const isDisabled = disabled; // Allow typing in preview mode for better UX

  // Get current number value
  const currentNumber = value?.value_number ?? null;
  const displayValue = currentNumber !== null ? String(currentNumber) : "";

  // Generate placeholder text
  const placeholderText = property.name?.[locale] ? `Enter ${property.name[locale]}` : "Enter number";

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

  // Handle number change (only save in entry mode)
  const handleChange = useCallback(
    (inputValue: string) => {
      if (isDisabled) return;

      // In preview mode, allow typing but don't persist changes
      if (mode === ValueInputMode.PREVIEW) {
        // Just allow the input to update visually
        return;
      }

      // In entry mode, save changes
      if (!onChange || !value) return;

      // Handle empty input (valid case)
      if (inputValue === "") {
        const updatedValue: Value = {
          ...value,
          value_number: null,
        };
        onChange(updatedValue);
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

      const updatedValue: Value = {
        ...value,
        value_number: clampedNumber,
      };

      onChange(updatedValue);
    },
    [isDisabled, onChange, value, clampNumber, mode],
  );

  // Base input props
  const baseInputProps = {
    type: "number" as const,
    placeholder: placeholderText,
    disabled: isDisabled,
    min,
    max,
    step: isInteger ? 1 : 0.01,
    className: cn(
      "w-full",
      isRequired && currentNumber === null && "ring-red-200",
      isDisabled && "cursor-not-allowed opacity-50",
      mode === ValueInputMode.PREVIEW && "bg-blue-50 border-blue-200",
    ),
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isDisabled) {
        handleChange(e.target.value);
      }
    },
  };

  // In preview mode, use uncontrolled inputs, in entry mode use controlled
  const inputProps =
    mode === ValueInputMode.PREVIEW
      ? { ...baseInputProps, defaultValue: displayValue }
      : { ...baseInputProps, value: displayValue };

  return (
    <div className="space-y-1">
      <Input {...inputProps} />
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
