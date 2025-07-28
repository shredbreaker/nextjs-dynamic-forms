/**
 * @fileoverview Property Row Context - Provides property ID to components
 *
 * 🎯 PURPOSE: Context provider that supplies propertyId to all property-related components
 *
 * 🏗️ ARCHITECTURE DECISIONS:
 * - Single responsibility: only provides propertyId, not entire property data
 * - Used by all property hooks to identify which property to operate on
 * - Wraps property row components to establish property scope
 * - Enables hooks to work without prop drilling propertyId everywhere
 *
 * 🤖 AI GUIDANCE - Context Usage Rules:
 * ✅ WRAP property editing components at row level
 * ✅ USE with property hooks (they automatically get propertyId from context)
 * ✅ NEST inside PropertyRowProvider to access propertyId
 * ✅ CLEAN separation: context provides ID, hooks provide data
 *
 * ❌ NEVER put property data in context (use hooks for data access)
 * ❌ NEVER create multiple property contexts (one per property hierarchy)
 * ❌ NEVER use outside of PropertyRowProvider wrapper
 *
 * 💡 USAGE PATTERN:
 * ```tsx
 * <PropertyRowProvider propertyId={propertyId}>
 *   <PropertyEditorCard />    // Components inside can use property hooks
 *   <PropertyPreview />   // Hooks automatically get propertyId from context
 * </PropertyRowProvider>
 * ```
 *
 * 📚 REFERENCE: See docs/architecture/domain-editor/hook-patterns.md
 */
"use client";

import { createContext, useContext } from "react";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";

/**
 * 📋 Context data structure - minimal and focused
 */
export interface PropertyRowContextType {
  propertyId: string;
}

/**
 * 🎯 Context instance - provides property ID to child components
 */
export const PropertyRowContext = createContext<PropertyRowContextType | null>(null);

/**
 * 🎁 Context Provider - wraps property components to establish scope
 *
 * @param propertyId - UUID of the property to provide context for
 * @param children - Child components that need access to propertyId
 */
export const PropertyRowProvider = ({ propertyId, children }: { propertyId: string; children: React.ReactNode }) => {
  useDebugRender("PropertyRowProvider");
  return <PropertyRowContext.Provider value={{ propertyId }}>{children}</PropertyRowContext.Provider>;
};

/**
 * 🎣 Context Hook - safely access property ID with error handling
 *
 * 🤖 AI GUIDANCE: Use this in property hooks and components
 * ✅ GOOD: const { propertyId } = usePropertyContext();
 * ❌ BAD: Using useContext(PropertyRowContext) directly (no error handling)
 *
 * @returns PropertyRowContextType with propertyId
 * @throws Error if used outside PropertyRowProvider
 */
export const usePropertyContext = () => {
  const context = useContext(PropertyRowContext);
  if (!context) {
    throw new Error("usePropertyContext must be used within a PropertyRowProvider");
  }
  return context;
};
