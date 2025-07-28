import { memo } from "react";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";
import { PropertyOptionMultiToggle } from "./multi-toggle";
import { PropertyOptionSortingToggle } from "./sort-toggle";

// Meta Settings Component for multi/single and sorting toggles
export const PropertyOptionMetaSettings = memo(function PropertyOptionMetaSettings() {
  useDebugRender("PropertyOptionMetaSettings");
  return (
    <div className="flex w-full flex-row items-center justify-between space-x-1">
      <div className="flex items-center px-1">
        <PropertyOptionMultiToggle />
      </div>
      <div className="flex items-center px-1">
        <PropertyOptionSortingToggle />
      </div>
    </div>
  );
});
