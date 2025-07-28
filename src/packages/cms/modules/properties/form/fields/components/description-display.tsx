"use client";

/**
 * @fileoverview Property Description Display - Reactive localized description display
 */
import { memo } from "react";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";
import { usePropertyDescriptionDisplay } from "@cms/modules/properties/form/fields/hooks";

export const PropertyDescriptionDisplay = memo(function PropertyDescriptionDisplay({
  fallback = "",
}: {
  fallback?: string;
}) {
  useDebugRender("PropertyDescriptionDisplay");
  const displayDescription = usePropertyDescriptionDisplay() || fallback;

  return <span className="truncate text-sm leading-relaxed text-gray-600">{displayDescription}</span>;
});

PropertyDescriptionDisplay.displayName = "PropertyDescriptionDisplay";
