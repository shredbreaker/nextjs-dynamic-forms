"use client";

/**
 * @fileoverview Property Name Display - Reactive localized name display
 */
import { memo } from "react";
import { cn } from "@shared-ui/lib/utils";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";
import { usePropertyNameDisplay } from "@cms/modules/properties/form/fields/hooks";
export const PropertyNameDisplay = memo(function PropertyNameDisplay({
  fallback = "",
  className,
}: {
  fallback?: string;
  className?: string;
}) {
  useDebugRender("PropertyNameDisplay");
  const displayName = usePropertyNameDisplay() || fallback;

  return <span className={cn("truncate", className)}>{displayName}</span>;
});

PropertyNameDisplay.displayName = "PropertyNameDisplay";
