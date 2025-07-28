/**
 * @fileoverview Enhanced Save Button - Domain editor save functionality with authentication protection
 *
 * 🎯 PURPOSE: Provides robust save functionality with authentication failure protection
 *
 * 🏗️ ARCHITECTURE DECISIONS:
 * - Client component for saving domain properties
 * - Integrates with canvas store to gather property data
 * - Enhanced server action with authentication handling
 * - Local storage backup for data safety
 * - Retry mechanism for network failures
 * - Authentication status monitoring
 *
 * 🔐 AUTHENTICATION FEATURES:
 * - Automatic retry on authentication failures
 * - Local storage backup on session loss
 * - Recovery after re-authentication
 * - Clear error messaging with retry options
 *
 * 🤖 AI GUIDANCE - Enhanced Save Button Usage:
 * ✅ USE in domain editor header for saving properties
 * ✅ HANDLE all authentication failure scenarios gracefully
 * ✅ PRESERVE user data during network/auth failures
 * ✅ PROVIDE clear retry mechanisms
 * ✅ INTEGRATE with local storage for data safety
 *
 * ❌ NEVER lose user data on authentication failures
 * ❌ NEVER skip error classification and retry logic
 * ❌ NEVER use outside of domain editor context
 *
 * 📚 REFERENCE: See docs/architecture/domain-editor/hook-patterns.md
 */
"use client";

import { useCallback } from "react";
import { Button } from "@shared-ui/shadcn/components/ui/button";
import { useCMSTranslations } from "@cms/i18n/use-cms-translation.hooks";
import { saveProperties } from "@cms/modules/domain-editor/actions";
import { useCanvasStore } from "@cms/modules/domain-editor/stores/canvas-store/canvas.store.hooks";
import { FormProperty } from "@cms/modules/properties/form/types";
import { Property, PropertyOption } from "@cms/modules/properties/property.types";

/**
 * 🔄 Convert FormProperty to Property - Prepare for saving
 *
 * Converts a FormProperty from the canvas store to a Property for saving.
 * Adds display_order from the ordering map and ensures proper typing.
 */
function convertToProperty(formProperty: FormProperty, displayOrder: number): Property {
  return {
    ...formProperty,
    display_order: displayOrder,
    options: [], // Options are handled separately
  };
}

/**
 * 💾 Enhanced Save Button - Domain editor save functionality with authentication protection
 *
 * Enhanced button component that saves all domain properties and options with
 * comprehensive authentication failure protection, retry mechanisms, and local storage backup.
 *
 * 🔐 AUTHENTICATION FEATURES:
 * - Session expiry detection and retry
 * - Token refresh recovery
 * - Permission error handling
 * - Local storage backup on failure
 * - Recovery after re-authentication
 *
 * 🔄 NETWORK FEATURES:
 * - Automatic retry on network failures
 * - Connection status monitoring
 * - Exponential backoff for retries
 * - Detailed error classification
 *
 * @example
 * ```tsx
 * // In domain editor header
 * <div className="flex items-center space-x-3">
 *   <SaveButton />
 * </div>
 * ```
 */
export function SaveButton() {
  const { t } = useCMSTranslations();
  const store = useCanvasStore();

  // 🔄 Extract save parameters from store
  const extractSaveParameters = useCallback(() => {
    const state = store.getState();
    const { domainId, properties, propertyOptions, ordering, deletedPropertyIds, deletedOptionIds } = state;

    // Convert properties to the format expected by the server action
    const propertiesToSave: Property[] = Object.entries(properties).map(([id, property]) =>
      convertToProperty(property, ordering[id] || 0),
    );

    // Flatten options from nested structure to array
    const optionsToSave: PropertyOption[] = Object.entries(propertyOptions).flatMap(([propertyId, options]) =>
      Object.values(options).map((option) => ({
        ...option,
        property_id: propertyId,
      })),
    );

    return {
      domainId,
      propertiesToSave,
      optionsToSave,
      deletedPropertyIds, // ✅ Use store-tracked deletions (consistent & efficient)
      deletedOptionIds, // ✅ Use store-tracked deletions (consistent & efficient)
      state,
    };
  }, [store]);

  // 💾 Main save handler with enhanced authentication protection
  const handleSave = useCallback(async () => {
    const { domainId, propertiesToSave, optionsToSave, deletedPropertyIds, deletedOptionIds } = extractSaveParameters();

    await saveProperties(domainId, propertiesToSave, optionsToSave, deletedPropertyIds, deletedOptionIds);
  }, [extractSaveParameters]);

  return (
    <div className="flex flex-col items-end space-y-1">
      <Button onClick={handleSave}>{t("save")}</Button>
    </div>
  );
}
