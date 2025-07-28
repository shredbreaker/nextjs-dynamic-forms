/**
 * Reactive Value Input Types
 *
 * This file contains types for context-based reactive value input components.
 * These components must be used within a PropertyValueProvider context.
 */
import { PropertyUnitType } from "@cms-data/modules/properties/property.types";
import { ValueInputMode } from "./value-input.types";

/**
 * Base props for all reactive value input components
 *
 * Reactive components get most of their data from context rather than props
 */
export interface ReactiveValueInputBaseProps {
  /** Override disabled state */
  disabled?: boolean;
  /** Additional class names */
  className?: string;
}

/**
 * PropertyValueContext state interface
 */
export interface PropertyValueContextState {
  /** Current property being edited/previewed */
  currentProperty: import("@cms/modules/properties/property.types").Property | null;
  /** Current translation locale */
  currentTranslation: string;
  /** Current value being edited */
  currentValue: import("@cms/modules/values/value.types").Value | null;
  /** Mode (preview vs entry) */
  mode: ValueInputMode;
  /** Original property ID for reference */
  propertyId?: string;
  /** Update handler */
  updateValue?: (value: import("@cms/modules/values/value.types").Value) => void;
}

/**
 * PropertyValueProvider props interface
 */
export interface PropertyValueProviderProps {
  /** Property ID to fetch from store */
  propertyId?: string;
  /** Direct property object (alternative to propertyId) */
  property?: import("@cms/modules/properties/property.types").Property | null;
  /** Current value data */
  value?: import("@cms/modules/values/value.types").Value | null;
  /** Input mode (preview or entry) */
  mode: ValueInputMode;
  /** Current locale code */
  locale?: string;
  /** Current translation locale code */
  translationLocale?: string;
  /** Update handler */
  onChange?: (value: import("@cms/modules/values/value.types").Value) => void;
  /** Children components */
  children: React.ReactNode;
}

/**
 * ReactivePropertyValueRenderer props interface
 */
export interface ReactivePropertyValueRendererProps {
  /** Optional custom onChange handler (overrides default) */
  onChange?: (value: import("@cms/modules/values/value.types").Value) => void;
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

/**
 * ReactiveValueTextInput props interface
 */
export interface ReactiveValueTextInputProps extends ReactiveValueInputBaseProps {
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
  /** Custom change handler (overrides context default) */
  onChange?: (textValue: string) => void;
}

/**
 * ReactiveValueNumberInput props interface
 */
export interface ReactiveValueNumberInputProps extends ReactiveValueInputBaseProps {
  /** Override default min value from property meta */
  customMin?: number;
  /** Override default max value from property meta */
  customMax?: number;
  /** Override default integer constraint from property meta */
  customInteger?: boolean;
  /** Override default placeholder text */
  customPlaceholder?: string;
  /** Number formatting options */
  formatting?: {
    showThousandsSeparator?: boolean;
  };
  /** Custom change handler (overrides context default) */
  onChange?: (numberValue: number | null) => void;
}

/**
 * ReactiveValueBoolInput props interface
 */
export interface ReactiveValueBoolInputProps extends ReactiveValueInputBaseProps {
  /** Override default label text */
  customLabel?: string;
  /** Whether to use switch instead of checkbox */
  variant?: "checkbox" | "switch";
  /** Custom change handler (overrides context default) */
  onChange?: (boolValue: boolean) => void;
}

/**
 * ReactiveValueOptionInput props interface
 */
export interface ReactiveValueOptionInputProps extends ReactiveValueInputBaseProps {
  /** Override default label text */
  customLabel?: string;
  /** Custom change handler (overrides context default) */
  onChange?: (optionIds: string[]) => void;
}

/**
 * ReactiveValueSizeInput props interface
 */
export interface ReactiveValueSizeInputProps extends ReactiveValueInputBaseProps {
  /** Override default label text */
  customLabel?: string;
  /** Override default unit type */
  defaultUnit?: PropertyUnitType;
  /** Custom change handler (overrides context default) */
  onChange?: (sizeValue: { value: number; unit: PropertyUnitType }) => void;
}
