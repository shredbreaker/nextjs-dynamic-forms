"use client";

import React, { useCallback } from "react";
import { cn } from "@shared-ui/lib/utils";
import { Switch } from "@shared-ui/shadcn/components/ui/switch";
import { ValueBoolInputProps, ValueInputMode } from "@cms/modules/values/types/value-input.types";
import { Value } from "@cms/modules/values/value.types";

export function ValueBoolInput({
  property,
  value,
  mode,
  locale = "en",
  disabled = false,
  onChange,
  variant = "checkbox",
}: ValueBoolInputProps): React.JSX.Element {
  const isRequired = property.is_required;
  const isDisabled = disabled; // Allow interaction in preview mode

  // Get current boolean value
  const currentBool = value?.value_bool ?? false;

  // Get display label (for internal use)
  const label = property.name?.[locale] || property.code || "Boolean Field";

  // Handle boolean change (only save in entry mode)
  const handleChange = useCallback(
    (checked: boolean) => {
      if (isDisabled) return;

      // In preview mode, allow interaction but don't persist changes
      if (mode === ValueInputMode.PREVIEW) {
        // Just allow the input to update visually
        return;
      }

      // In entry mode, save changes
      if (!onChange || !value) return;

      const updatedValue: Value = {
        ...value,
        value_bool: checked,
      };

      onChange(updatedValue);
    },
    [isDisabled, onChange, value, mode],
  );

  // Base container styling
  const containerClass = cn(
    "flex items-center space-x-2 p-2 rounded-md bg-transparent",
    isDisabled && "opacity-50 cursor-not-allowed",
  );

  // Label styling
  const labelClass = cn(
    "text-sm font-medium text-gray-700",
    isRequired && "after:content-['*'] after:text-red-500 after:ml-1",
  );

  // For preview mode, use uncontrolled checkbox, for entry mode use controlled
  const checkboxProps = mode === ValueInputMode.PREVIEW ? { defaultChecked: currentBool } : { checked: currentBool };

  if (variant === "switch") {
    // Switch variant (using role for testing)
    return (
      <div className={containerClass}>
        <label className="flex cursor-pointer items-center">
          <input type="checkbox" role="switch" {...checkboxProps} onChange={(e) => handleChange(e.target.checked)} />
          <div
            className={cn(
              "peer relative h-6 w-11 rounded-full bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 peer-focus:outline-none",
              "after:absolute after:top-[2px] after:left-[2px] after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white",
              "after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all",
              "peer-checked:bg-blue-600",
              isDisabled && "cursor-not-allowed opacity-50",
            )}
          />
          <span className={cn(labelClass, "ml-3")}>{label}</span>
        </label>
      </div>
    );
  }

  // Default checkbox variant
  return (
    <div className={containerClass}>
      <label htmlFor={`bool-${property.id}`} className={cn(labelClass, "cursor-pointer")}>
        {label}
      </label>
      <Switch id={`bool-${property.id}`} defaultChecked />
    </div>
  );
}
