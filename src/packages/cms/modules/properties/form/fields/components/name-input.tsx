"use client";

/**
 * @fileoverview Property Name Simple Input - Basic input for property names
 */
import { memo } from "react";
import { Input } from "@shared-ui/shadcn/components/ui/input";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";
import { usePropertyNameInputControlled } from "@cms/modules/properties/form/fields/hooks";

export const PropertyNameInput = memo(function PropertyNameInput() {
  useDebugRender("PropertyNameInput");
  const { inputId, value, onChange, placeholder } = usePropertyNameInputControlled("Input");

  return (
    <div className="flex w-full">
      <Input
        id={inputId}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="h-8 bg-transparent py-0 shadow-none dark:bg-transparent"
      />
    </div>
  );
});

PropertyNameInput.displayName = "PropertyNameInput";
