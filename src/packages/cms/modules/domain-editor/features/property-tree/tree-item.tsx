"use client";

import { memo, useCallback } from "react";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";
import { usePropertyNameDisplay, usePropertyCodeDisplay } from "@cms/modules/properties/form/fields/hooks";
import { usePropertyId } from "@cms/modules/properties/form/hooks";

/**
 * 🎯 Tree Item - Clickable navigation to property editor
 *
 * Provides click handler to focus and scroll to the corresponding property
 * editor when user clicks on tree item.
 */
export const TreeItem = memo(() => {
  useDebugRender("TreeItem");
  const propertyId = usePropertyId();

  /**
   * 🔍 Navigate to property editor on click
   */
  const handleClick = useCallback(() => {
    const element = document.querySelector(`#property-${propertyId}`);
    if (element) {
      const input = element.querySelector("input");
      input?.focus();
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [propertyId]);

  return (
    <button onClick={handleClick} className="text-left group-hover:cursor-pointer">
      <TreeItemName />
    </button>
  );
});

const TreeItemName = memo(function TreeItemName() {
  useDebugRender("TreeItemName");
  const displayName = usePropertyNameDisplay();
  const code = usePropertyCodeDisplay();
  const title = displayName || code || "Untitled Property";
  return <span className="text-muted-foreground truncate text-xs">{title}</span>;
});
TreeItemName.displayName = "TreeItemName";
TreeItem.displayName = "TreeItem";
