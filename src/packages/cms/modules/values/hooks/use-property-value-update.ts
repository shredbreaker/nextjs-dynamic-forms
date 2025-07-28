/**
 * @fileoverview Hook for updating property values through context
 *
 * 🎯 PURPOSE: Provides a consistent way to update property values from components
 *
 * 🏗️ ARCHITECTURE DECISIONS:
 * - Uses PropertyValueContext for updates
 * - Simplifies value updates for reactive components
 *
 * 💡 USAGE PATTERN:
 * ```tsx
 * const updateTextValue = usePropertyValueUpdate();
 * updateTextValue("new text value"); // For text property
 * ```
 */
"use client";

import { PropertyUnitType } from "@cms-data/modules/properties/property.types";
import { usePropertyValue } from "@cms/modules/values/contexts/property-value.context";

/**
 * Hook for updating text property values through context
 *
 * @returns A function to update text values
 */
export function usePropertyTextUpdate(): (newText: string) => void {
  const { currentProperty, currentValue, currentTranslation, updateValue } = usePropertyValue();

  return (newText: string): void => {
    if (!currentProperty || !updateValue || currentProperty.type !== "text") {
      return;
    }

    // Create a new value object or use the existing one
    const updatedValue = { ...(currentValue || {}) };

    // Initialize value_text if needed
    if (!updatedValue.value_text) {
      updatedValue.value_text = {};
    }

    // Update the text for the current translation
    updatedValue.value_text[currentTranslation] = newText;

    // Update the value through context
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateValue(updatedValue as any);
  };
}

/**
 * Hook for updating number property values through context
 *
 * @returns A function to update number values
 */
export function usePropertyNumberUpdate(): (newNumber: number | null) => void {
  const { currentProperty, currentValue, updateValue } = usePropertyValue();

  return (newNumber: number | null): void => {
    if (!currentProperty || !updateValue || currentProperty.type !== "number") {
      return;
    }

    // Create a new value object or use the existing one
    const updatedValue = { ...(currentValue || {}) };

    // Update the number value
    updatedValue.value_number = newNumber;

    // Update the value through context
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateValue(updatedValue as any);
  };
}

/**
 * Hook for updating boolean property values through context
 *
 * @returns A function to update boolean values
 */
export function usePropertyBoolUpdate(): (newBool: boolean) => void {
  const { currentProperty, currentValue, updateValue } = usePropertyValue();

  return (newBool: boolean): void => {
    if (!currentProperty || !updateValue || currentProperty.type !== "bool") {
      return;
    }

    // Create a new value object or use the existing one
    const updatedValue = { ...(currentValue || {}) };

    // Update the boolean value
    updatedValue.value_bool = newBool;

    // Update the value through context
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateValue(updatedValue as any);
  };
}

/**
 * Hook for updating option property values through context
 *
 * @returns A function to update option values
 */
export function usePropertyOptionUpdate(): (optionIds: string[]) => void {
  const { currentProperty, currentValue, updateValue } = usePropertyValue();

  return (optionIds: string[]): void => {
    if (!currentProperty || !updateValue || currentProperty.type !== "option") {
      return;
    }

    // Create a new value object or use the existing one
    const updatedValue = { ...(currentValue || {}) };

    // Update the options value
    updatedValue.value_uuids = optionIds;

    // Update the value through context
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateValue(updatedValue as any);
  };
}

/**
 * Hook for updating size property values through context
 *
 * @returns A function to update size values
 */
export function usePropertySizeUpdate(): (size: { value: number; unit: string }) => void {
  const { currentProperty, currentValue, updateValue } = usePropertyValue();

  return (size: { value: number; unit: string }): void => {
    if (!currentProperty || !updateValue || currentProperty.type !== "size") {
      return;
    }

    // Create a new value object or use the existing one
    const updatedValue = { ...(currentValue || {}) };

    // Update the size value
    updatedValue.value_number = size.value;
    updatedValue.value_data = {
      type: "size",
      unit_type: size.unit as PropertyUnitType,
    };

    // Update the value through context
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateValue(updatedValue as any);
  };
}
