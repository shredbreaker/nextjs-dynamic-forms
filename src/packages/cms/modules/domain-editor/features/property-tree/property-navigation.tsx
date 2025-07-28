"use client";

import { memo } from "react";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";
import { TreeContent } from "./tree-content";

export const PropertyNavigation = memo(function PropertyNavigation({
  variant = "default",
}: {
  variant?: "default" | "mobile";
}) {
  useDebugRender("PropertyNavigation");

  const isMobileVariant = variant === "mobile";

  return (
    <div
      className={`bg-secondary rounded opacity-100 transition-all duration-300 ease-in-out ${isMobileVariant ? "w-full overflow-visible" : "max-w-48 min-w-20 overflow-hidden"} `}
    >
      <div className="flex h-full w-full flex-col">
        <TreeContent variant={variant} />
      </div>
    </div>
  );
});
