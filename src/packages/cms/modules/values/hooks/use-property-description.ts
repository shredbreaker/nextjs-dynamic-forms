/**
 * @fileoverview Property Description Hook - Reactive description generation for form fields
 *
 * 🎯 PURPOSE: Provides reactive descriptions/help text that update with property changes and translations
 *
 * 🏗️ ARCHITECTURE DECISIONS:
 * - Follows usePropertyDisplay pattern for reactive data access
 * - Integrates with PropertyValueContext for automatic updates
 * - Memoized for performance optimization
 * - Smart fallback: custom → translated description → property hint → null
 *
 * 🤖 AI GUIDANCE:
 * ✅ USE for form field descriptions, help text, tooltips
 * ✅ REACTIVE to property and translation changes automatically
 * ✅ MEMOIZED to prevent unnecessary re-renders
 * ✅ RETURNS null when no description available (clean UI)
 *
 * 💡 USAGE:
 * ```tsx
 * function FormField() {
 *   const description = usePropertyDescription(); // Reactive to property + translation
 *   return (
 *     <FormFieldLayout
 *       title="Title"
 *       description={description} // Only shows if description exists
 *     >
 *       <input />
 *     </FormFieldLayout>
 *   );
 * }
 * ```
 */
"use client";

import { useMemo } from "react";
import { usePropertyValue } from "@cms/modules/values/contexts/property-value.context";

/**
 * 📖 Reactive Property Description Hook
 *
 * Generates reactive descriptions that automatically update when:
 * - Property description changes
 * - Translation locale changes
 * - Property metadata changes
 *
 * @param customDescription - Optional override description (takes priority)
 * @returns Reactive description string or null if no description available
 *
 * @example
 * ```tsx
 * // Basic usage - gets description from property metadata
 * const description = usePropertyDescription();
 *
 * // With custom override
 * const description = usePropertyDescription("Custom help text");
 *
 * // In FormFieldLayout component
 * <FormFieldLayout description={usePropertyDescription()}>
 *   <input />
 * </FormFieldLayout>
 * ```
 */
export function usePropertyDescription(customDescription?: string): string | null {
  const { currentProperty, currentTranslation } = usePropertyValue();

  return useMemo(() => {
    // 1. Custom description takes highest priority
    if (customDescription) return customDescription;

    // 2. Property description in current translation
    if (currentProperty?.description?.[currentTranslation]) {
      return currentProperty.description[currentTranslation];
    }

    // 3. Future: Property hint/help text from meta could be added here
    // Currently property meta doesn't include localized descriptions

    // 4. No description available
    return null;
  }, [customDescription, currentProperty?.description, currentTranslation]);
}
