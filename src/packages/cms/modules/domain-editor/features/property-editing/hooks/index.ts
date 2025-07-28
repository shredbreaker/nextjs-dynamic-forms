/**
 * @fileoverview Property Editing Hooks - Consolidated hook exports
 *
 * 🎯 PURPOSE: Central exports for all property-related hooks
 *
 * This module consolidates:
 * - Property CRUD operations (usePropertyCRUD, useProperty, useProperties)
 * - Property Options operations (usePropertyOptionCRUD, usePropertyOptionInput, etc.)
 *
 * 🏗️ ARCHITECTURE: Clean separation between:
 * - use-property.ts: Main property operations
 * - use-property-options.ts: Option operations within properties
 */

// Property CRUD operations
export { usePropertyCRUD, useProperty, useProperties } from "./use-property";

// Property Options operations
export {
  usePropertyOptionInput,
  useOrderedPropertyOptions,
  usePropertyOptionCRUD,
  usePropertyOptionCount,
  usePropertyOptionLimitReached,
} from "./use-property-options";
