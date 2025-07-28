"use client";

/**
 * @fileoverview Property Name Floating Input - Floating label input for property names
 */
import { memo } from "react";
import { FloatingInput, FloatingLabel } from "@shared-ui/shadcn/components/ui/floating-label-input";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";
import { usePropertyNameInputControlled } from "@cms/modules/properties/form/fields/hooks";

export const PropertyNameFloatingInput = memo(function PropertyNameFloatingInput() {
  useDebugRender("PropertyNameFloatingInput");
  const { inputId, value, onChange, placeholder } = usePropertyNameInputControlled("FloatingInput");

  return (
    <div className="relative flex w-full">
      <FloatingInput
        id={inputId}
        value={value}
        onChange={onChange}
        className="selection:bg-primary border-b-0 bg-transparent not-placeholder-shown:translate-y-2 focus:translate-y-2 dark:bg-transparent"
      />
      <FloatingLabel htmlFor={inputId} className="start-0 max-w-[calc(100%-0.5rem)]">
        {placeholder}
      </FloatingLabel>
    </div>
  );
});

PropertyNameFloatingInput.displayName = "PropertyNameFloatingInput";
