"use client";

import { memo } from "react";
import { PropertyMetaText, PropertyMetaNumber, PropertyMetaOption } from "@cms/modules/properties/property.types";
import { usePropertyValue } from "@cms/modules/values/contexts/property-value.context";
import { Value } from "@cms/modules/values/value.types";
import { ReactiveValueBoolInput } from "./inputs/ReactiveValueBoolInput";
import { ReactiveValueNumberInput } from "./inputs/ReactiveValueNumberInput";
import { ReactiveValueOptionInput } from "./inputs/ReactiveValueOptionInput";
import { ReactiveValueSizeInput } from "./inputs/ReactiveValueSizeInput";
import { ReactiveValueTextInput } from "./inputs/ReactiveValueTextInput";

/**
 * 🔄 REACTIVE PropertyValueRenderer - Uses context instead of props
 *
 * Routes to appropriate input component based on property type from context.
 * Must be used within PropertyValueProvider context.
 */

export interface ReactivePropertyValueRendererProps {
  /** Optional custom onChange handler (overrides default) */
  onChange?: (value: Value) => void;
  /** Optional disabled state override */
  disabled?: boolean;
  /** Component overrides for custom input types */
  componentOverrides?: {
    text?: React.ComponentType<Record<string, unknown>>;
    number?: React.ComponentType<Record<string, unknown>>;
    bool?: React.ComponentType<Record<string, unknown>>;
    option?: React.ComponentType<Record<string, unknown>>;
    size?: React.ComponentType<Record<string, unknown>>;
  };
  /** Additional props passed to input components */
  [key: string]: unknown;
}

export const PropertyValueRenderer = memo(function PropertyValueRenderer({
  onChange,
  disabled = false,
  componentOverrides,
  ...restProps
}: ReactivePropertyValueRendererProps): React.ReactNode {
  // 🔄 REACTIVE: Get all data from context
  const { currentProperty, currentValue, currentTranslation } = usePropertyValue();

  if (!currentProperty) {
    return <div className="text-gray-400">No property selected</div>;
  }
  // Helper to create updated value on change
  const handleValueChange = (newTypedValue: unknown) => {
    if (!onChange) return;

    // Create a new value object or clone the existing one
    const newValue: Value = currentValue
      ? { ...currentValue }
      : {
          id: `temp-${Date.now()}`,
          property_id: currentProperty.id,
          record_id: "temp-record",
          value_text: null,
          value_number: null,
          value_bool: null,
          value_data: null,
          value_uuids: null,
          is_new: true,
        };

    // Update the appropriate field based on property type
    switch (currentProperty.type) {
      case "text":
        newValue.value_text = {
          ...(newValue.value_text || {}),
          [currentTranslation]: newTypedValue as string,
        };
        break;
      case "number":
        newValue.value_number = newTypedValue as number;
        break;
      case "bool":
        newValue.value_bool = newTypedValue as boolean;
        break;
      case "option":
        newValue.value_uuids = newTypedValue as string[];
        break;
      case "size":
        // Handle size type which has both number value and unit type
        const sizeValue = newTypedValue as {
          value: number;
          unit: import("@cms-data/modules/properties/property.types").PropertyUnitType;
        };
        newValue.value_number = sizeValue.value;
        newValue.value_data = {
          type: "size",
          unit_type: sizeValue.unit,
        };
        break;
    }

    onChange(newValue);
  };

  // Helper to extract constraints from property metadata
  const getConstraintsFromMeta = (): Record<string, unknown> => {
    if (!currentProperty.meta) return {};

    switch (currentProperty.type) {
      case "text": {
        const meta = currentProperty.meta as PropertyMetaText;
        return {
          multiline: meta.multiline || false,
          maxLength: meta.max || undefined,
          // Remove placeholder as it's handled by ValueTextInput using hooks
        };
      }
      case "number": {
        const meta = currentProperty.meta as PropertyMetaNumber;
        return {
          min: meta.min,
          max: meta.max,
          integer: meta.integer || false,
          placeholder: `Enter ${currentProperty.name?.[currentTranslation] || currentProperty.code}`,
        };
      }
      case "option": {
        const meta = currentProperty.meta as PropertyMetaOption;
        return {
          multi: meta.multi || false,
          options: currentProperty.options || [],
        };
      }
      default:
        return {};
    }
  };

  // 🔄 REACTIVE: Input props use context data instead of props
  const inputProps = {
    // Temporary: Still pass property until ValueTextInput is updated to use hooks
    property: currentProperty,
    value: currentValue,
    // Context data is now injected automatically by input components using hooks
    // Only pass overrides and additional functionality
    disabled,
    onChange: handleValueChange,
    // Add property-specific constraints
    ...getConstraintsFromMeta(),
    ...restProps,
  };

  // Route to appropriate input component based on property type
  // First check for component override, then use default
  switch (currentProperty.type) {
    case "text":
      return componentOverrides?.text ? (
        <componentOverrides.text {...inputProps} />
      ) : (
        // Use the reactive text input instead of the prop-based version
        <ReactiveValueTextInput
          disabled={disabled}
          onChange={(textValue) => onChange && handleValueChange(textValue)}
        />
      );
    case "number":
      return componentOverrides?.number ? (
        <componentOverrides.number {...inputProps} />
      ) : (
        // Use the reactive number input instead of placeholder
        <ReactiveValueNumberInput
          disabled={disabled}
          onChange={(numberValue) => onChange && handleValueChange(numberValue)}
        />
      );
    case "bool":
      return componentOverrides?.bool ? (
        <componentOverrides.bool {...inputProps} />
      ) : (
        // Use the reactive boolean input instead of placeholder
        <ReactiveValueBoolInput
          disabled={disabled}
          onChange={(boolValue) => onChange && handleValueChange(boolValue)}
        />
      );
    case "option":
      return componentOverrides?.option ? (
        <componentOverrides.option {...inputProps} />
      ) : (
        // Use the reactive option input instead of placeholder
        <ReactiveValueOptionInput
          disabled={disabled}
          onChange={(optionIds) => onChange && handleValueChange(optionIds)}
        />
      );
    case "size":
      return componentOverrides?.size ? (
        <componentOverrides.size {...inputProps} />
      ) : (
        // Use the reactive size input instead of placeholder
        <ReactiveValueSizeInput
          disabled={disabled}
          onChange={(sizeValue) =>
            onChange &&
            handleValueChange({
              value: sizeValue.value,
              unit: sizeValue.unit,
            })
          }
        />
      );
    default:
      return <div className="text-sm text-red-500">Unsupported type: {currentProperty.type}</div>;
  }
});
