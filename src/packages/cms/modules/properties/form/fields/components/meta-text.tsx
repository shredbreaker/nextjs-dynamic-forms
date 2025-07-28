"use client";

import { ToggleGroup, ToggleGroupItem } from "@radix-ui/react-toggle-group";
import { memo } from "react";
import { Input } from "@shared-ui/shadcn/components/ui/input";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";
import {
  usePropertyMetaTextMaxInputControlled,
  usePropertyMetaTextMultilineToggle,
} from "@cms/modules/properties/form/fields/hooks/use-meta-text";

export const PropertyMetaTextMultilineToggle = memo(function PropertyMetaTextMultilineToggle() {
  useDebugRender("PropertyMetaTextMultilineToggle");
  const { isActive, handleToggle } = usePropertyMetaTextMultilineToggle();

  return (
    <ToggleGroup type="single" value={isActive ? "true" : "false"} onValueChange={handleToggle}>
      <ToggleGroupItem value="true">{isActive ? "Multiline" : "Singleline"}</ToggleGroupItem>
    </ToggleGroup>
  );
});

export const PropertyMetaTextMaxInput = memo(function PropertyMetaTextMaxInput() {
  useDebugRender("PropertyMetaTextMaxInput");
  const { inputId, value, onChange, placeholder } = usePropertyMetaTextMaxInputControlled("Input");

  return (
    <div className="flex w-full">
      <Input
        id={inputId}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="h-8 bg-transparent px-1 py-0 shadow-none dark:bg-transparent"
      />
    </div>
  );
});

PropertyMetaTextMaxInput.displayName = "PropertyMetaTextMaxInput";
