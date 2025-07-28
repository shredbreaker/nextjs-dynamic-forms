"use client";

import React, { useCallback, useState } from "react";
import { cn } from "@shared-ui/lib/utils";
import { Input } from "@shared-ui/shadcn/components/ui/input";
import { PropertyUnitType } from "@cms-data/modules/properties/property.types";
import { ValueBaseDataSize } from "@cms-data/modules/values/value.types";
import { usePropertyValue, usePropertyLabel, usePropertySizeUpdate } from "@cms/modules/values/hooks";

/**
 * 🔄 REACTIVE: ReactiveValueSizeInput - Context-based size input component
 *
 * Updates automatically when:
 * - Property metadata changes
 * - Translation locale changes
 * - Value changes
 *
 * Must be used within PropertyValueProvider context.
 */
export interface ReactiveValueSizeInputProps {
  /** Override default label text */
  customLabel?: string;
  /** Override default unit type */
  defaultUnit?: PropertyUnitType;
  /** Override disabled state */
  disabled?: boolean;
  /** Custom change handler (overrides context default) */
  onChange?: (sizeValue: { value: number; unit: PropertyUnitType }) => void;
  /** Additional class names */
  className?: string;
}

/**
 * 🔄 REACTIVE: Enhanced size input using PropertyValueContext
 * Allows entering a numeric value and selecting a unit type
 */
export function ReactiveValueSizeInput({
  customLabel,
  defaultUnit,
  disabled: externalDisabled,
  onChange: externalOnChange,
  className,
}: ReactiveValueSizeInputProps): React.JSX.Element {
  // 🔄 REACTIVE: Get context values that update automatically
  const { currentProperty, currentValue } = usePropertyValue();
  const label = usePropertyLabel(customLabel);
  const updateSizeValue = usePropertySizeUpdate();

  // 🔄 REACTIVE: Extract constraints from property with safe fallbacks
  const isRequired = currentProperty?.is_required ?? false;

  // 🔄 REACTIVE: Get current size value and unit
  const sizeData = currentValue?.value_data as ValueBaseDataSize | null;
  const currentNumber = currentValue?.value_number ?? null;
  const currentUnit = sizeData?.unit_type ?? defaultUnit ?? "sqm";

  // Local state for unit selection
  const [unit, setUnit] = useState<PropertyUnitType>(currentUnit);

  // Display value for the input
  const displayValue = currentNumber !== null ? String(currentNumber) : "";

  // Determine if input should be disabled (external prop overrides context)
  const isDisabled = externalDisabled !== undefined ? externalDisabled : false;

  // Handle number change
  const handleNumberChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (isDisabled) return;

      const inputValue = e.target.value;

      // Handle empty input
      if (inputValue === "") {
        // Call external onChange if provided
        if (externalOnChange) {
          externalOnChange({ value: 0, unit });
        } else {
          // Update through context
          updateSizeValue({ value: 0, unit });
        }
        return;
      }

      // Parse number and validate
      const parsed = parseFloat(inputValue);
      if (isNaN(parsed)) {
        // Don't update for invalid numbers
        return;
      }

      // Call external onChange if provided
      if (externalOnChange) {
        externalOnChange({ value: parsed, unit });
      } else {
        // Update through context
        updateSizeValue({ value: parsed, unit });
      }
    },
    [isDisabled, externalOnChange, unit, updateSizeValue],
  );

  // Handle unit change
  const handleUnitChange = useCallback(
    (newUnit: PropertyUnitType) => {
      if (isDisabled) return;

      setUnit(newUnit);

      // Call external onChange if provided with current number and new unit
      if (externalOnChange && currentNumber !== null) {
        externalOnChange({ value: currentNumber, unit: newUnit });
      } else if (currentNumber !== null) {
        // Update through context
        updateSizeValue({ value: currentNumber, unit: newUnit });
      }
    },
    [isDisabled, externalOnChange, currentNumber, updateSizeValue],
  );

  // Safety check for context initialization - after all hooks have been called
  if (!currentProperty) {
    return <div className="text-muted-foreground">No property available</div>;
  }

  // Unit options
  const unitOptions: { value: PropertyUnitType; label: string }[] = [
    { value: "sqm", label: "m²" },
    { value: "rai", label: "Rai" },
    { value: "ngan", label: "Ngan" },
    { value: "wah", label: "Wah" },
  ];

  return (
    <div className={cn("space-y-2", className)}>
      <div className="mb-2 text-sm font-medium">
        {/* {label} */}
        {isRequired && <span className="ml-1 text-red-500">*</span>}
      </div>

      <div className="flex items-center gap-2">
        {/* Number input */}
        <div className="flex-1">
          <Input
            type="number"
            placeholder={`Enter ${label}...`}
            disabled={isDisabled}
            defaultValue={displayValue}
            onChange={handleNumberChange}
            className={cn(
              "w-full",
              isRequired && currentNumber === null && "ring-red-200",
              isDisabled && "cursor-not-allowed opacity-50",
            )}
          />
        </div>

        {/* Unit selector */}
        <div className="flex items-center gap-1">
          {unitOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              disabled={isDisabled}
              onClick={() => handleUnitChange(option.value)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm",
                unit === option.value
                  ? "border-blue-300 bg-blue-100 text-blue-800"
                  : "border-gray-200 bg-gray-50 text-gray-700",
                isDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Unit explanation */}
      <div className="text-xs text-gray-500">
        {unit === "sqm" && "Square meters (m²)"}
        {unit === "rai" && "Rai (1 Rai = 1,600 m²)"}
        {unit === "ngan" && "Ngan (1 Ngan = 400 m²)"}
        {unit === "wah" && "Square Wah (1 Wah = 4 m²)"}
      </div>
    </div>
  );
}
