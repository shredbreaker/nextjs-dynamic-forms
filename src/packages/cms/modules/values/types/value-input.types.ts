/**
 * Value Input Types
 *
 * This file contains types and enums for value input components.
 */

/**
 * ValueInputMode - Enum for input component modes
 *
 * PREVIEW: Used in property preview mode, changes are not persisted
 * ENTRY: Used in record editing mode, changes are persisted
 */
export enum ValueInputMode {
  PREVIEW = "preview",
  ENTRY = "entry",
}

/**
 * Base props for all value input components
 */
export interface ValueInputBaseProps {
  /** Full property object with type and metadata */
  property: import("@cms/modules/properties/property.types").Property;
  /** Current value data */
  value?: import("@cms/modules/values/value.types").Value | null;
  /** Default value data (for uncontrolled mode) */
  defaultValue?: import("@cms/modules/values/value.types").Value | null;
  /** Input mode (preview or entry) */
  mode?: ValueInputMode;
  /** Current locale code */
  locale?: string;
  /** Whether input is disabled */
  disabled?: boolean;
  /** Change handler */
  onChange?: (value: import("@cms/modules/values/value.types").Value) => void;
  /** Additional class names */
  className?: string;
}

/**
 * Text input specific props
 */
export interface ValueTextInputProps extends Omit<ValueInputBaseProps, "onChange"> {
  /** Placeholder text */
  placeholder?: string;
  /** Whether to use multiline input */
  multiline?: boolean;
  /** Maximum character length */
  maxLength?: number;
  /** Whether to show floating label */
  floatingLabel?: boolean;
  /** Label text (for floating label) */
  label?: string;
  /** Whether to auto-resize textarea (multiline only) */
  autoResize?: boolean;
  /** Maximum visible height before scrolling (multiline only) */
  maxVisibleHeight?: number;
  /** Change handler for full value object */
  onChange?: (value: import("@cms/modules/values/value.types").Value) => void;
}

/**
 * Number input specific props
 */
export interface ValueNumberInputProps extends Omit<ValueInputBaseProps, "onChange"> {
  /** Placeholder text */
  placeholder?: string;
  /** Minimum allowed value */
  min?: number;
  /** Maximum allowed value */
  max?: number;
  /** Step value for incrementing/decrementing */
  step?: number;
  /** Whether to use integer values only */
  integer?: boolean;
  /** Number formatting options */
  formatting?: {
    showThousandsSeparator?: boolean;
  };
  /** Change handler for full value object */
  onChange?: (value: import("@cms/modules/values/value.types").Value) => void;
}

/**
 * Boolean input specific props
 */
export interface ValueBoolInputProps extends Omit<ValueInputBaseProps, "onChange"> {
  /** Label text */
  label?: string;
  /** Whether to use switch instead of checkbox */
  useSwitch?: boolean;
  /** Input variant (checkbox or switch) */
  variant?: "checkbox" | "switch";
  /** Change handler for full value object */
  onChange?: (value: import("@cms/modules/values/value.types").Value) => void;
}

/**
 * Option input specific props
 */
export interface ValueOptionInputProps extends ValueInputBaseProps {
  /** Show search/filter for options */
  searchable?: boolean;
  /** Maximum visible options before scrolling */
  maxVisibleOptions?: number;
}

/**
 * Size input specific props
 */
export interface ValueSizeInputProps extends ValueInputBaseProps {
  /** Default unit to show */
  defaultUnit?: string;
}

/**
 * PropertyValueRenderer props - Enhanced interface with full Property object
 */
export interface PropertyValueRendererProps extends ValueInputBaseProps {
  /** Additional component overrides for specific property types */
  componentOverrides?: Record<string, React.ComponentType<ValueInputBaseProps>>;
}
