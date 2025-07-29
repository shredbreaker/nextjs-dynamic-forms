/**
 * @fileoverview Property Advanced Settings - Conditional rendering based on property type
 *
 * 🎯 PURPOSE: Renders type-specific settings components based on current property type
 *
 * 🏗️ ARCHITECTURE DECISIONS:
 * - Conditional rendering based on REACTIVE property type
 * - Lazy loading for heavy PropertyOptionSettings component
 * - Suspense boundaries for better loading UX
 * - Memoized content to prevent unnecessary re-calculations
 *
 * 🤖 AI GUIDANCE - Component Behavior:
 * ✅ REACTIVE to property type changes (must update when type changes)
 * ✅ Lazy loads heavy components (option settings)
 * ✅ Proper suspense fallback for loading states
 * ✅ Memoized switch logic for performance
 *
 * 🔧 RECENT FIX: Now uses usePropertyDisplay instead of usePropertyValue
 * to ensure settings update when property type changes
 *
 * 📚 REFERENCE: See docs/architecture/domain-editor/hook-patterns.md
 */
import { memo, useMemo, Suspense, lazy } from "react";
import { cn } from "@shared-ui/lib/utils";
import { PropertyNumberSettings, PropertyTextSettings } from "@cms/modules/domain-editor/features/property-editing";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";
import { usePropertyDisplay } from "@cms/modules/domain-editor/hooks/use-property";
import { PropertyDescriptionFloatingInput } from "@cms/modules/properties/form/fields/components";
import { FormProperty } from "@cms/modules/properties/form/types";

/**
 * 🏋️ Lazy load heavy component to improve initial bundle size
 */
const PropertyOptionSettings = lazy(
  () => import("@cms/modules/domain-editor/features/property-editing/components/settings/property-option-settings"),
);

/**
 * ⚙️ Property Advanced Settings - Conditional type-specific settings
 *
 * 🔧 FIXED: Now uses usePropertyDisplay for reactive property type
 * Previously used usePropertyValue (static) which caused stale type detection
 */
export const PropertyAdvanced = memo(function PropertyAdvanced() {
  useDebugRender("PropertyAdvanced");

  // ✅ FIXED: Using usePropertyDisplay for reactive updates
  const propertyType = usePropertyDisplay({
    getValue: (property: FormProperty) => property.type || "text",
  });

  /**
   * 🎛️ Conditional settings based on property type
   */
  const content = useMemo(() => {
    switch (propertyType) {
      case "text":
        return <PropertyTextSettings />;
      case "number":
        return <PropertyNumberSettings />;
      case "bool":
        return null;
      case "option":
        return (
          <Suspense fallback={<div className="bg-muted/30 h-32 animate-pulse rounded" />}>
            <PropertyOptionSettings />
          </Suspense>
        );
      case "size":
        return null;
    }
  }, [propertyType]);

  const showDescriptionBottomBorder = content !== null;

  return (
    <div className="flex w-full flex-col items-start justify-center space-y-2 rounded-none border-t-1 px-2 pt-1 pb-1">
      <div className={cn("flex w-full rounded-none px-2", showDescriptionBottomBorder && "border-b-1")}>
        <PropertyDescriptionFloatingInput />
      </div>
      {content}
    </div>
  );
});

export default PropertyAdvanced;
