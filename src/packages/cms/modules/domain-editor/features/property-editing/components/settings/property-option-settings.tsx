import { memo, useCallback, useContext } from "react";
import { PropertyRowContext } from "@cms/modules/domain-editor/contexts";
import { PropertyOptionMetaSettings, PropertyOptionList } from "@cms/modules/domain-editor/features/property-editing";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";
import { useCanvasStore } from "@cms/modules/domain-editor/stores/canvas-store";
import { FormProperty } from "@cms/modules/properties/form/types";

export const PropertyOptionSettings = memo(function PropertyOptionSettings() {
  useDebugRender("PropertyOptionSettings");
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
    <div data-testid="property-option-settings" className="flex w-full flex-col space-y-2">
      {/* Meta Settings Section */}
      <div data-testid="property-option-meta-settings" className="flex w-full items-center">
        <PropertyOptionMetaSettings />
      </div>

      {/* Option List Section */}
      <div data-testid="property-option-list" className="flex w-full flex-col">
        <PropertyOptionList />
      </div>
    </div>
  );
});

// Add default export for lazy loading
export default PropertyOptionSettings;
