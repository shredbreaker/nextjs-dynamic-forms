import { memo, useCallback, useContext } from "react";
import { PropertyRowContext } from "@cms/modules/domain-editor/contexts";
import { PropertyOptionBadgeContainer } from "@cms/modules/domain-editor/features/property-editing/components/property-options/base/property-option-badge-container";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";
import { useCanvasStore } from "@cms/modules/domain-editor/stores/canvas-store";
import { FormProperty } from "@cms/modules/properties/form/types";

/**
 * 🏷️ Property Option Compact List - Badge-style options interface
 *
 * Compact mode component for simple property options management.
 * Uses badge-style interface with horizontal scrolling and confirmation dialogs.
 *
 * Features:
 * - Badge-style option display with delete confirmation
 * - Horizontal scrolling with auto-scroll to add field
 * - Enter key support for quick option creation
 * - Expand button for full management popup
 * - Integration with existing property options data flow
 *
 * 📚 REFERENCE: Phase 1 implementation of property-options-management-plan.md
 */
export const PropertyOptionCompactList = memo(function PropertyOptionCompactList() {
  useDebugRender("PropertyOptionCompactList");
  const { propertyId } = useContext(PropertyRowContext)!;
  const store = useCanvasStore();

  // Check if property type is "option"
  const getPropertyType = useCallback((property: FormProperty) => property.type, []);
  const propertyType = store((state) => {
    const property = state.properties[propertyId];
    return property ? getPropertyType(property) : null;
  });

  // Only render for option type properties
  if (propertyType !== "option") {
    return null;
  }

  return (
    <div
      data-testid="property-option-compact-settings"
      className="flex w-full flex-col items-start justify-center space-y-2 rounded-none border-t-1 px-2 pt-3 pb-1"
    >
      {/* 🏷️ Badge-style options interface (Phase 1 implementation) */}
      <div className="flex w-full rounded-none">
        <PropertyOptionBadgeContainer />
      </div>
    </div>
  );
});

PropertyOptionCompactList.displayName = "PropertyOptionCompactList";
