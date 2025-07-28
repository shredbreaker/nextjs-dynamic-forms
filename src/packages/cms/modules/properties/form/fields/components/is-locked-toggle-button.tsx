import { Lock } from "lucide-react";
import { memo } from "react";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";
import { PropertyToggleButton, PropertyToggleButtonProps } from "./utils/property-toggle-button";

export const PropertyLockToggleButton = memo(function PropertyLockToggleButton(
  props: Omit<PropertyToggleButtonProps, "propertyKey" | "icon" | "tooltipKey">,
) {
  useDebugRender("PropertyLockToggleButton");
  return (
    <PropertyToggleButton
      propertyKey="is_locked"
      icon={Lock}
      tooltipKey={{ active: "property.is-locked.tooltip.on", inactive: "property.is-locked.tooltip.off" }}
      {...props}
    />
  );
});

PropertyLockToggleButton.displayName = "PropertyLockToggleButton";
