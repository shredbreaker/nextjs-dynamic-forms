/**
 * @fileoverview Property Placeholder Hook - Reactive placeholder generation for inputs
 *
 * 🎯 PURPOSE: Provides reactive placeholders that update with property changes and translations
 *
 * 🏗️ ARCHITECTURE DECISIONS:
 * - Follows usePropertyDisplay pattern for reactive data access
 * - Integrates with PropertyValueContext for automatic updates
 * - Memoized for performance optimization
 * - Smart fallback: custom → "Enter {label}..." → "Enter field..."
 *
 * 🤖 AI GUIDANCE:
 * ✅ USE for input placeholders that should update with translations
 * ✅ REACTIVE to property and translation changes automatically
 * ✅ MEMOIZED to prevent unnecessary re-renders
 *
 * 💡 USAGE:
 * ```tsx
 * function ValueInput() {
 *   const placeholder = usePropertyPlaceholder(); // Reactive to property + translation
 *   const customPlaceholder = usePropertyPlaceholder("Type here..."); // With override
 *   return <input placeholder={placeholder} />;
 * }
 * ```
 */
"use client";

import { useMemo } from "react";
import { usePropertyValue } from "@cms/modules/values/contexts/property-value.context";

/**
 * 📝 Reactive Property Placeholder Hook
 *
 * Generates reactive placeholders that automatically update when:
 * - Property name changes
 * - Translation locale changes
 * - Property code changes
 *
 * @param customPlaceholder - Optional override placeholder (takes priority)
 * @returns Reactive placeholder string with smart generation
 *
 * @example
 * ```tsx
 * // Basic usage - generates "Enter Property Name..." automatically
 * const placeholder = usePropertyPlaceholder();
 *
 * // With custom override
 * const placeholder = usePropertyPlaceholder("Type your answer here...");
 *
 * // In input component
 * <input placeholder={usePropertyPlaceholder()} />
 * ```
 */
export function usePropertyPlaceholder(customPlaceholder?: string): string {
  const { currentProperty, currentTranslation } = usePropertyValue();

  return useMemo(() => {
    // 1. Custom placeholder takes highest priority
    if (customPlaceholder) return customPlaceholder;

    // 2. Generate from property name in current translation
    if (currentProperty?.name?.[currentTranslation]) {
      return `Enter ${currentProperty.name[currentTranslation]}...`;
    }

    // 3. Generate from property code as fallback
    if (currentProperty?.code) {
      return `Enter ${currentProperty.code}...`;
    }

    // 4. Default fallback
    return "Enter field";
  }, [customPlaceholder, currentProperty?.name, currentProperty?.code, currentTranslation]);
}
