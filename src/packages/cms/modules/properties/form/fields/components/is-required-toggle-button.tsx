import { Asterisk } from "lucide-react";
import { memo } from "react";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";
import { PropertyToggleButton, PropertyToggleButtonProps } from "./utils/property-toggle-button";

export const PropertyRequiredToggleButton = memo(function PropertyRequiredToggleButton(
  props: Omit<PropertyToggleButtonProps, "propertyKey" | "icon" | "tooltipKey">,
) {
  useDebugRender("PropertyRequiredToggleButton");
  return (
    <PropertyToggleButton
      propertyKey="is_required"
      icon={Asterisk}
      tooltipKey={{ active: "property.is-required.tooltip.on", inactive: "property.is-required.tooltip.off" }}
      {...props}
    />
  );
});

PropertyRequiredToggleButton.displayName = "PropertyRequiredToggleButton";
