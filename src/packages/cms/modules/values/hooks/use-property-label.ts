/**
 * @fileoverview Property Label Hook - Reactive label generation for value components
 *
 * 🎯 PURPOSE: Provides reactive labels that update with property changes and translations
 *
 * 🏗️ ARCHITECTURE DECISIONS:
 * - Follows usePropertyDisplay pattern for reactive data access
 * - Integrates with PropertyValueContext for automatic updates
 * - Memoized for performance optimization
 * - Smart fallback: custom → translated name → property code → default
 *
 * 🤖 AI GUIDANCE:
 * ✅ USE for form labels, field titles, component headers
 * ✅ REACTIVE to translation changes automatically
 * ✅ MEMOIZED to prevent unnecessary re-renders
 *
 * 💡 USAGE:
 * ```tsx
 * function FormField() {
 *   const label = usePropertyLabel(); // Reactive to property + translation changes
 *   const customLabel = usePropertyLabel("Custom Override"); // With override
 *   return <label>{label}</label>;
 * }
 * ```
 */
"use client";

import { useMemo } from "react";
import { useCMSTranslations } from "@cms/i18n/use-cms-translation.hooks";
import { usePropertyValue } from "@cms/modules/values/contexts/property-value.context";

/**
 * 🏷️ Reactive Property Label Hook
 *
 * Generates reactive labels that automatically update when:
 * - Property name changes
 * - Translation locale changes
 * - Property code changes
 *
 * @param customLabel - Optional override label (takes priority)
 * @returns Reactive label string with smart fallbacks
 *
 * @example
 * ```tsx
 * // Basic usage - reactive to property and translation changes
 * const label = usePropertyLabel();
 *
 * // With custom override
 * const label = usePropertyLabel("Custom Title");
 *
 * // In FormField component
 * <label htmlFor="input">{usePropertyLabel()}</label>
 * ```
 */
export function usePropertyLabel(customLabel?: string): string {
  const { currentProperty, currentTranslation } = usePropertyValue();
  const { t } = useCMSTranslations();

  return useMemo(() => {
    // 1. Custom label takes highest priority
    if (customLabel) return customLabel;

    // 2. Property name in current translation
    if (currentProperty?.name?.[currentTranslation]) {
      return currentProperty.name[currentTranslation];
    }

    // 3. Property code as fallback
    if (currentProperty?.code) {
      return currentProperty.code;
    }

    // 4. Default fallback
    return t("property.name.label");
  }, [customLabel, currentProperty?.name, currentProperty?.code, currentTranslation, t]);
}
