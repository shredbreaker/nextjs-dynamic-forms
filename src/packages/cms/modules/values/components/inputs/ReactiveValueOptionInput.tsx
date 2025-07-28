"use client";

import React, { useCallback, useMemo } from "react";
import { cn } from "@shared-ui/lib/utils";
import { useCanvasStore } from "@cms/modules/domain-editor/stores/canvas-store/canvas.store.hooks";
import { PropertyMetaOption } from "@cms/modules/properties/property.types";
import { usePropertyValue, usePropertyOptionUpdate } from "@cms/modules/values/hooks";

/**
 * 🔄 REACTIVE: ReactiveValueOptionInput - Context-based option input component
 *
 * Updates automatically when:
 * - Property metadata changes
 * - Translation locale changes
 * - Value changes
 * - Options list changes
 *
 * Must be used within PropertyValueProvider context.
 */
export interface ReactiveValueOptionInputProps {
  /** Override default label text */
  customLabel?: string;
  /** Override disabled state */
  disabled?: boolean;
  /** Custom change handler (overrides context default) */
  onChange?: (optionIds: string[]) => void;
  /** Additional class names */
  className?: string;
}

/**
 * 🔄 REACTIVE: Enhanced option input using PropertyValueContext
 * Renders as checkboxes for multi-select or radio buttons for single select
 */
export function ReactiveValueOptionInput({
  disabled: externalDisabled,
  onChange: externalOnChange,
  className,
}: ReactiveValueOptionInputProps): React.JSX.Element {
  // 🔄 REACTIVE: Get context values that update automatically
  const { currentProperty, currentValue, currentTranslation, propertyId } = usePropertyValue();
  const updateOptionValue = usePropertyOptionUpdate();
  const canvasStore = useCanvasStore();

  // 🔄 REACTIVE: Extract metadata constraints from property with safe fallbacks
  const meta = currentProperty?.meta as PropertyMetaOption | null;
  const isMultiSelect = meta?.multi ?? false;
  const isRequired = currentProperty?.is_required ?? false;

  // 🔄 REACTIVE: Get current selected option IDs
  const selectedOptionIds = useMemo(() => currentValue?.value_uuids ?? [], [currentValue?.value_uuids]);

  // 🔄 REACTIVE: Get store options (memoized to prevent infinite loops)
  const storeOptions = canvasStore((state) => {
    if (!propertyId) return null;
    return state.propertyOptions[propertyId] || null;
  });

  // 🔄 REACTIVE: Get available options with stable references
  const options = useMemo(() => {
    // First try store options
    if (storeOptions) {
      return Object.values(storeOptions);
    }
    // Fallback to property options
    return currentProperty?.options ?? [];
  }, [storeOptions, currentProperty?.options]);

  // Determine if input should be disabled (external prop overrides context)
  const isDisabled = externalDisabled !== undefined ? externalDisabled : false;

  // Handle option selection change (unified for both single and multi)
  const handleOptionChange = useCallback(
    (optionId: string) => {
      if (isDisabled) return;

      let newSelectedIds: string[];

      if (isMultiSelect) {
        // Multi-select: toggle the option
        if (selectedOptionIds.includes(optionId)) {
          // Remove option from selection
          newSelectedIds = selectedOptionIds.filter((id) => id !== optionId);
        } else {
          // Add option to selection
          newSelectedIds = [...selectedOptionIds, optionId];
        }
      } else {
        // Single-select: set only this option
        newSelectedIds = [optionId];
      }

      // Call external onChange if provided
      if (externalOnChange) {
        externalOnChange(newSelectedIds);
      } else {
        // Update through context
        updateOptionValue(newSelectedIds);
      }
    },
    [isDisabled, isMultiSelect, selectedOptionIds, externalOnChange, updateOptionValue],
  );

  // Safety check for context initialization - after all hooks have been called
  if (!currentProperty) {
    return <div className="text-muted-foreground">No property available</div>;
  }

  // Container styling
  const containerClass = cn("space-y-2", className);

  // If no options available
  if (options.length === 0) {
    return <div className="text-sm text-gray-500">No options available</div>;
  }

  // Render unified button-style selectors (like size input)
  return (
    <div className={containerClass}>
      <div className="mb-2 text-sm font-medium">{isRequired && <span className="ml-1 text-red-500">*</span>}</div>

      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selectedOptionIds.includes(option.option_id);
          return (
            <button
              key={option.option_id}
              type="button"
              disabled={isDisabled}
              onClick={() => handleOptionChange(option.option_id)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm",
                isSelected ? "border-blue-300 bg-blue-100 text-blue-800" : "border-gray-200 bg-gray-50 text-gray-700",
                isDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
              )}
            >
              {option.name?.[currentTranslation] || option.code}
            </button>
          );
        })}
      </div>

      {/* Show selection count for multi-select */}
      {isMultiSelect && selectedOptionIds.length > 0 && (
        <div className="mt-2 text-xs text-gray-500">
          Selected: {selectedOptionIds.length} option{selectedOptionIds.length !== 1 ? "s" : ""}
        </div>
      )}

      {/* Show validation message for single-select */}
      {!isMultiSelect && selectedOptionIds.length === 0 && isRequired && (
        <div className="mt-1 text-xs text-amber-500">Please select an option</div>
      )}
    </div>
  );
}
