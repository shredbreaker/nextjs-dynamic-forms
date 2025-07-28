"use client";

/**
 * @fileoverview Property Code Input - Product-ready, minimal dependency, modular
 */
import { memo } from "react";
import { Input } from "@shared-ui/shadcn/components/ui/input";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";
import { usePropertyCodeInputControlled } from "@cms/modules/properties/form/fields/hooks";
import { useProperty } from "@cms/modules/properties/form/hooks";

export const PropertyCodeInput = memo(function PropertyCodeInput() {
  useDebugRender("PropertyCodeInput");
  const { inputId, value, onChange, placeholder } = usePropertyCodeInputControlled();

  const isLocked = useProperty((property) => property.is_locked);

  return (
    <div className="flex w-full bg-transparent">
      <span className="border-input inline-flex h-8 items-center rounded-s-md rounded-b-none border-0 border-e-1 px-3 font-mono text-xs">
        Code
      </span>
      <Input
        id={inputId}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={isLocked}
        className="h-8 bg-transparent py-0 font-mono text-xs dark:bg-transparent"
      />
    </div>
  );
});

PropertyCodeInput.displayName = "PropertyCodeInput";
