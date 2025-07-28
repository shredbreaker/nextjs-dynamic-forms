import { useCallback, memo } from "react";
import { FloatingInput, FloatingLabel } from "@shared-ui/shadcn/components/ui/floating-label-input";
import { usePropertyOptionCRUD, usePropertyOptionInput } from "@cms/modules/domain-editor/features/property-editing";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";
import { PropertyOption } from "@cms/modules/properties/property.types";

export const PropertyOptionCodeInput = memo(function PropertyOptionCodeInput({
  propertyId,
  optionId,
}: {
  propertyId: string;
  optionId: string;
}) {
  useDebugRender("PropertyOptionCodeInput");

  const { updateOptionCode } = usePropertyOptionCRUD(propertyId);

  const getValue = useCallback((option: PropertyOption | undefined) => option?.code || "", []);

  const setValue = useCallback(
    (optionId: string, locale: string, value: string) => {
      updateOptionCode(optionId, value.trim());
    },
    [updateOptionCode],
  );

  const { inputRef, defaultValue, onChange } = usePropertyOptionInput({
    propertyId,
    optionId,
    getValue,
    setValue,
    locale: "",
  });

  const inputId = `property-option-code-input-${optionId}`;

  return (
    <div className="relative flex w-full" key={optionId}>
      <FloatingInput
        id={inputId}
        ref={inputRef}
        defaultValue={defaultValue}
        onChange={onChange}
        className="selection:bg-primary border-b-0 bg-transparent pl-0 font-mono text-xs not-placeholder-shown:translate-y-2 focus:translate-y-2 dark:bg-transparent"
      />
      <FloatingLabel
        htmlFor={inputId}
        className="start-0 max-w-[calc(100%-0.5rem)] overflow-hidden pl-0 text-ellipsis whitespace-nowrap peer-focus:pl-0"
      >
        Code
      </FloatingLabel>
    </div>
  );
});

PropertyOptionCodeInput.displayName = "PropertyOptionCodeInput";
