/**
 * @fileoverview Property Value Context - Provides reactive property and value data
 *
 * 🎯 PURPOSE: Context provider that supplies reactive property and value data to components
 *
 * 🏗️ ARCHITECTURE DECISIONS:
 * - Follows PropertyRowContext pattern but with full reactive data
 * - Integrates with canvasStore and layoutStore for reactivity
 * - Provides property, value, locale, and mode data
 * - Enables hooks to work without prop drilling complex data
 *
 * 🤖 AI GUIDANCE - Context Usage Rules:
 * ✅ WRAP value components at container level
 * ✅ USE with property value hooks (they automatically get data from context)
 * ✅ NEST inside PropertyValueProvider to access reactive data
 * ✅ CLEAN separation: context provides reactive data, hooks provide specific accessors
 *
 * ❌ NEVER use outside of PropertyValueProvider wrapper
 * ❌ NEVER put business logic in context (use hooks for complex operations)
 * ❌ NEVER create multiple value contexts per component tree
 *
 * 💡 USAGE PATTERN:
 * ```tsx
 * <PropertyValueProvider propertyId={propertyId} value={value} mode={ValueInputMode.PREVIEW}>
 *   <PropertyValueRenderer />  // Components inside can use value hooks
 *   <ValueTextInput />         // Hooks automatically get data from context
 * </PropertyValueProvider>
 * ```
 *
 * 📚 REFERENCE: See docs/architecture/property-value-reactivity-implementation.md
 */
"use client";

import { createContext, useContext, useMemo } from "react";
import { useCanvasStore } from "@cms/modules/domain-editor/stores/canvas-store/canvas.store.hooks";
import { useLayoutStore } from "@cms/modules/domain-editor/stores/layout-store";
import {
  PropertyValueContextState,
  PropertyValueProviderProps,
} from "@cms/modules/values/types/reactive-value-input.types";

/**
 * 🎯 Context instance - provides reactive property and value data
 */
export const PropertyValueContext = createContext<PropertyValueContextState | null>(null);

/**
 * 🎁 Context Provider - wraps value components to provide reactive data
 *
 * Follows PropertyRowProvider pattern but provides full reactive data access.
 * Connects to canvasStore and layoutStore for automatic updates.
 *
 * @param propertyId - UUID of the property to provide context for (reactive from store)
 * @param property - Direct property object (alternative to propertyId)
 * @param value - Current value being edited
 * @param mode - Input mode (preview vs entry)
 * @param children - Child components that need access to reactive data
 */
export function PropertyValueProvider({
  propertyId,
  property,
  value = null,
  mode,
  translationLocale,
  onChange,
  children,
}: PropertyValueProviderProps) {
  const canvasStore = useCanvasStore();
  const layoutStore = useLayoutStore();

  // 🔄 REACTIVE: Updates when property changes in store
  const currentProperty = canvasStore((state) => {
    if (property) return property; // Use direct property if provided
    if (!propertyId) return null;
    return state.properties[propertyId] || null;
  });

  // 🔄 REACTIVE: Get translation locale from layout store
  const currentTranslation = translationLocale || layoutStore((state) => state.currentTranslation);

  // 🎯 Memoized context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    (): PropertyValueContextState => ({
      currentProperty,
      currentTranslation,
      currentValue: value,
      mode,
      propertyId,
      updateValue: onChange,
    }),
    [currentProperty, currentTranslation, value, mode, propertyId, onChange],
  );

  return <PropertyValueContext.Provider value={contextValue}>{children}</PropertyValueContext.Provider>;
}

/**
 * 🎣 Context Hook - safely access reactive property value data
 *
 * 🤖 AI GUIDANCE: Use this in property value hooks and components
 * ✅ GOOD: const { currentProperty, currentTranslation } = usePropertyValue();
 * ❌ BAD: Using useContext(PropertyValueContext) directly (no error handling)
 *
 * @returns PropertyValueContextState with reactive data
 * @throws Error if used outside PropertyValueProvider
 */
export function usePropertyValue() {
  const context = useContext(PropertyValueContext);
  if (!context) {
    throw new Error("usePropertyValue must be used within a PropertyValueProvider");
  }
  return context;
}
