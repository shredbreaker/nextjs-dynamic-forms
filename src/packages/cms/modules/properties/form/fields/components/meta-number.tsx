"use client";

/**
 * @fileoverview Property Name Simple Input - Basic input for property names
 */
import { ToggleGroup, ToggleGroupItem } from "@radix-ui/react-toggle-group";
import { memo } from "react";
import { Input } from "@shared-ui/shadcn/components/ui/input";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";
import {
  usePropertyMetaNumberMinInputControlled,
  usePropertyMetaNumberMaxInputControlled,
  usePropertyMetaNumberIntegerToggle,
} from "@cms/modules/properties/form/fields/hooks/use-meta-number";

export const PropertyMetaNumberIntegerToggle = memo(function PropertyMetaNumberIntegerToggle() {
  useDebugRender("PropertyMetaNumberIntegerToggle");
  const { isActive, handleToggle } = usePropertyMetaNumberIntegerToggle();

  return (
    <ToggleGroup type="single" value={isActive ? "true" : "false"} onValueChange={handleToggle}>
      <ToggleGroupItem value="true">{isActive ? "Integer" : "Float"}</ToggleGroupItem>
    </ToggleGroup>
  );
});

export const PropertyMetaNumberMaxInput = memo(function PropertyMetaNumberMaxInput() {
  useDebugRender("PropertyMetaNumberMaxInput");
  const { inputId, value, onChange, placeholder } = usePropertyMetaNumberMaxInputControlled("Input");

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

PropertyMetaNumberMaxInput.displayName = "PropertyMetaNumberMaxInput";

export const PropertyMetaNumberMinInput = memo(function PropertyMetaNumberMinInput() {
  useDebugRender("PropertyMetaNumberMinInput");
  const { inputId, value, onChange, placeholder } = usePropertyMetaNumberMinInputControlled("Input");

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

PropertyMetaNumberMinInput.displayName = "PropertyMetaNumberMinInput";
