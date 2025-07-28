import { EyeOff } from "lucide-react";
import { memo } from "react";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";
import { PropertyToggleButton, PropertyToggleButtonProps } from "./utils/property-toggle-button";

export const PropertyPrivateToggleButton = memo(function PropertyPrivateToggleButton(
  props: Omit<PropertyToggleButtonProps, "propertyKey" | "icon" | "tooltipKey">,
) {
  useDebugRender("PropertyPrivateToggleButton");
  return (
    <PropertyToggleButton
      propertyKey="is_private"
      icon={EyeOff}
      tooltipKey={{ active: "property.is-private.tooltip.on", inactive: "property.is-private.tooltip.off" }}
      {...props}
    />
  );
});

PropertyPrivateToggleButton.displayName = "PropertyPrivateToggleButton";
