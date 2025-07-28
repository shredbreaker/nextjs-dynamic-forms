/**
 * @fileoverview Property Preview - Unified property preview component
 *
 * 🎯 PURPOSE: Renders property preview with reactive updates for all property types
 *
 * 🏗️ ARCHITECTURE DECISIONS:
 * - Unified preview component for all property types
 * - Uses PropertyValueProvider + PropertyValueRenderer pattern
 * - REACTIVE to property changes and translations
 * - Memoized to prevent unnecessary re-renders
 *
 * 🤖 AI GUIDANCE - Component Behavior:
 * ✅ REACTIVE to all property changes (type, name, constraints, etc.)
 * ✅ REACTIVE to translation changes
 * ✅ Unifies preview logic into a single component
 * ✅ Direct PropertyValueProvider wrapping for reactivity
 *
 * 🔧 RECENT REFACTOR: Simplified from type-specific components to unified pattern
 * using PropertyValueProvider + PropertyValueRenderer architecture.
 *
 * 📚 REFERENCE: See docs/architecture/property-value-reactivity-implementation.md
 */
"use client";

import { memo, useContext } from "react";
import { cn } from "@shared-ui/lib/utils";
import { PropertyRowContext } from "@cms/modules/domain-editor/contexts";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";
import {
  PropertyValueProvider,
  PropertyValueRenderer,
  ValueInputMode,
  FormFieldLayout,
  usePropertyLabel,
  usePropertyDescription,
  usePropertyValue,
} from "@cms/modules/values";

/**
 * 🎭 Unified Property Preview Component
 *
 * Provides reactive preview for all property types using:
 * - PropertyValueProvider for reactive context
 * - FormFieldLayout for consistent presentation
 * - PropertyValueRenderer for type-specific rendering
 *
 * Automatically handles:
 * - Translation changes (labels, placeholders)
 * - Property metadata updates (constraints)
 * - Type-specific rendering
 */
export const PropertyPreview = memo(function PropertyPreview() {
  useDebugRender("PropertyPreview");
  const { propertyId } = useContext(PropertyRowContext)!;

  return (
    <div className="bg-secondary ring-border rounded-md p-2 shadow-lg ring-1">
      <PropertyValueProvider propertyId={propertyId} value={null} mode={ValueInputMode.PREVIEW}>
        <PreviewContent />
      </PropertyValueProvider>
    </div>
  );
});

/**
 * Internal component that must be used within PropertyValueProvider
 * Uses context hooks to get reactive property data
 */
function PreviewContent() {
  useDebugRender("PreviewContent");

  // Get reactive data from context
  const label = usePropertyLabel();
  const description = usePropertyDescription();
  const { currentProperty } = usePropertyValue();

  // Safety check for context initialization
  if (!currentProperty) {
    return <div className="text-gray-400 italic">Property not found</div>;
  }

  return (
    <FormFieldLayout
      className={cn("", currentProperty.is_private ? "opacity-50" : "opacity-100")}
      title={label}
      description={description || undefined}
      required={currentProperty.is_required}
    >
      <PropertyValueRenderer />
    </FormFieldLayout>
  );
}

PropertyPreview.displayName = "PropertyPreview";
