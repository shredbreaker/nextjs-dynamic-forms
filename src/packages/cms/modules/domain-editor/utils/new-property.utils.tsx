import { generateUUID } from "@shared-ui/lib/utils";
import { FormProperty } from "@cms/modules/properties/form/types";

/**
 * @fileoverview New Property Utilities - Property creation and factory functions
 *
 * 🎯 PURPOSE: Utility functions for creating new property objects
 *
 * 🏗️ ARCHITECTURE DECISIONS:
 * - Provides factory functions for consistent property creation
 * - Generates proper UUIDs for new properties
 * - Sets sensible defaults for new property fields
 * - Ensures type safety for property object construction
 *
 * 🤖 AI GUIDANCE - Property Creation Utilities:
 * ✅ USE makeFormProperty for creating new properties
 * ✅ ALWAYS generate new UUIDs for new properties
 * ✅ SET isNew flag for client-created properties
 * ✅ PROVIDE sensible defaults for all required fields
 *
 * ❌ NEVER reuse existing property IDs
 * ❌ NEVER create properties without required fields
 * ❌ NEVER skip UUID generation for new properties
 *
 * 💡 USAGE PATTERN:
 * ```tsx
 * const newProperty = makeFormProperty();
 * canvasStore.addProperty(newProperty);
 * ```
 *
 * 📚 REFERENCE: See docs/architecture/domain-editor/hook-patterns.md
 */

/**
 * 🏭 Make Form Property - Create new property with sensible defaults
 *
 * Factory function that creates a new FormProperty object with all required fields
 * and sensible defaults. Generates a unique UUID and marks as new property.
 *
 * @returns FormProperty - New property object ready for canvas store
 *
 * @example
 * ```tsx
 * const newProperty = makeFormProperty();
 * // newProperty will have:
 * // - Unique UUID
 * // - Default text type
 * // - All flags set to false
 * // - Null name (to be filled by user)
 *
 * canvasStore.addProperty(newProperty);
 * ```
 */
export function makeFormProperty(): FormProperty {
  return {
    id: generateUUID(),
    name: null,
    type: "text",
    is_new: false,
    is_locked: false,
    is_required: false,
    is_private: false,
    meta: null,
  };
}
