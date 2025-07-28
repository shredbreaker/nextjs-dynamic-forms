"use client";

import React, { useCallback } from "react";
import { cn } from "@shared-ui/lib/utils";
import { Switch } from "@shared-ui/shadcn/components/ui/switch";
import { usePropertyValue, usePropertyLabel } from "@cms/modules/values/hooks";

/**
 * 🔄 REACTIVE: ReactiveValueBoolInput - Context-based boolean input component
 *
 * Updates automatically when:
 * - Property metadata changes
 * - Translation locale changes
 * - Value changes
 *
 * Must be used within PropertyValueProvider context.
 */
export interface ReactiveValueBoolInputProps {
  /** Override default label text */
  customLabel?: string;
  /** Whether to use switch instead of checkbox */
  variant?: "checkbox" | "switch";
  /** Override disabled state */
  disabled?: boolean;
  /** Custom change handler (overrides context default) */
  onChange?: (boolValue: boolean) => void;
  /** Additional class names */
  className?: string;
}

/**
 * 🔄 REACTIVE: Enhanced boolean input using PropertyValueContext
 */
export function ReactiveValueBoolInput({
  customLabel,
  variant = "checkbox",
  disabled: externalDisabled,
  onChange: externalOnChange,
  className,
}: ReactiveValueBoolInputProps): React.JSX.Element {
  // 🔄 REACTIVE: Get context values that update automatically
  const { currentProperty, currentValue } = usePropertyValue();
  const label = usePropertyLabel(customLabel);

  // 🔄 REACTIVE: Extract metadata constraints from property with safe fallbacks
  const isRequired = currentProperty?.is_required ?? false;

  // 🔄 REACTIVE: Get current boolean value
  const currentBool = currentValue?.value_bool ?? false;

  // Determine if input should be disabled (external prop overrides context)
  const isDisabled = externalDisabled !== undefined ? externalDisabled : false;

  // Handle boolean change
  const handleChange = useCallback(
    (checked: boolean) => {
      if (isDisabled) return;

      // Call external onChange if provided
      if (externalOnChange) {
        externalOnChange(checked);
      }
    },
    [isDisabled, externalOnChange],
  );

  // Safety check for context initialization - after all hooks have been called
  if (!currentProperty) {
    return <div className="text-muted-foreground">No property available</div>;
  }

  // Base container styling
  const containerClass = cn(
    "flex items-center space-x-2 p-2 rounded-md bg-transparent",
    isDisabled && "opacity-50 cursor-not-allowed",
    className,
  );

  // Label styling
  const labelClass = cn(
    "text-sm font-medium text-gray-700",
    isRequired && "after:content-['*'] after:text-red-500 after:ml-1",
  );

  if (variant === "switch") {
    // Switch variant (using role for testing)
    return (
      <div className={containerClass}>
        <label className="flex cursor-pointer items-center">
          <input
            type="checkbox"
            role="switch"
            disabled={isDisabled}
            className={cn("peer sr-only")}
            checked={currentBool}
            onChange={(e) => handleChange(e.target.checked)}
          />
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
    <div className={cn(containerClass, "flex w-full items-center justify-between")}>
      <label htmlFor={`bool-${currentProperty.id}`} className={cn(labelClass, "cursor-pointer")}>
        {label}
      </label>
      <Switch id={`bool-${currentProperty.id}`} defaultChecked />
    </div>
  );
}
