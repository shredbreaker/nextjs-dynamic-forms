"use client";

import { useCallback, useMemo, useRef } from "react";
import { useCMSTranslations } from "@cms/i18n/use-cms-translation.hooks";
import { usePropertyStore, usePropertyId, useProperty } from "@cms/modules/properties/form/hooks";
import { FormProperty } from "@cms/modules/properties/form/types";
import { generateInputId } from "@cms/modules/shared/form/utils/input-id.utils";

export function usePropertyTextDisplay(field: keyof FormProperty): string | undefined {
  return useProperty((property) => property[field] as string);
}

export function usePropertyTextInputControlled(
  field: keyof FormProperty,
  variant?: string,
): {
  inputId: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
} {
  const base = usePropertyTextInputBase(field, variant);
  const value = usePropertyTextDisplay(field) || "";

  return {
    ...base,
    value,
  };
}

export function usePropertyTextInputUncontrolled(
  field: keyof FormProperty,
  variant?: string,
): {
  inputId: string;
  placeholder: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  defaultValue: string;
} {
  const base = usePropertyTextInputBase(field, variant);

  const inputRef = useRef<HTMLInputElement>(null);
  const store = usePropertyStore();
  const propertyId = usePropertyId();

  const defaultValue = useMemo(() => {
    const property = store.getState().properties[propertyId];
    return (property?.[field] as string) || "";
  }, [store, propertyId, field]);

  return {
    ...base,
    inputRef,
    defaultValue,
  };
}

// Create in shared/form/hooks/use-property-text-input.ts
function usePropertyTextInputBase(
  field: keyof FormProperty,
  variant?: string,
): {
  inputId: string;
  placeholder: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
} {
  const { t } = useCMSTranslations();
  const propertyId = usePropertyId();
  const store = usePropertyStore();
  const { updateProperty } = store.getState();

  // Input ID for accessibility
  const inputId = useMemo(() => {
    return generateInputId("property", propertyId, field.toString(), variant);
  }, [propertyId, field, variant]);

  // Placeholder text using translations
  const placeholder = useMemo(() => {
    const fieldTranslationKey = `property.${field.toString()}.placeholder`;
    return t(fieldTranslationKey);
  }, [t, field]);

  // Change handler with field-specific validation (use action)
  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value.trim();
      updateProperty(propertyId, (draft) => {
        (draft[field] as string) = value;
      });
    },
    [updateProperty, propertyId, field],
  );

  return {
    inputId,
    placeholder,
    onChange,
  };
}
