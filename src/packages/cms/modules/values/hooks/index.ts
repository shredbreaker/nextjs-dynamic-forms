/**
 * @fileoverview Value Hooks Index - Export all reactive property value hooks
 *
 * 🎯 PURPOSE: Central export point for all property value reactive hooks
 *
 * 🏗️ ARCHITECTURE DECISIONS:
 * - Groups related hooks for easy importing
 * - Follows established CMS module index pattern
 * - Clear separation between reactive and static hooks
 *
 * 💡 USAGE:
 * ```tsx
 * import { usePropertyLabel, usePropertyPlaceholder } from "@cms/modules/values/hooks";
 * ```
 */

/**
 * Value Hooks Index
 *
 * This file exports all hooks related to property values
 */

// 🔄 Reactive Property Display Hooks
export { usePropertyLabel } from "./use-property-label";
export { usePropertyPlaceholder } from "./use-property-placeholder";
export { usePropertyDescription } from "./use-property-description";
export { useCharacterLimit } from "./use-character-limit";

// 🎯 Main Context Hook
export { usePropertyValue } from "../contexts/property-value.context";

// Value update hooks
export {
  usePropertyTextUpdate,
  usePropertyNumberUpdate,
  usePropertyBoolUpdate,
  usePropertyOptionUpdate,
  usePropertySizeUpdate,
} from "./use-property-value-update";
