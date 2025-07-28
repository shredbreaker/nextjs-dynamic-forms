"use client";

import { useMemo, useCallback, useRef } from "react";
import { useCMSTranslations } from "@cms/i18n/use-cms-translation.hooks";
import { useProperty } from "@cms/modules/properties/form";
import { usePropertyId, usePropertyStore } from "@cms/modules/properties/form/hooks";
import { PropertyMetaNumber } from "@cms/modules/properties/property.types";
import { generateInputId } from "@cms/modules/shared/form/utils/input-id.utils";

export function usePropertyMetaNumberMaxDisplay(): string | undefined {
  return usePropertyMetaNumberDisplay("max");
}

export function usePropertyMetaNumberMinDisplay(): string | undefined {
  return usePropertyMetaNumberDisplay("min");
}

export function usePropertyMetaNumberDisplay(field: keyof Pick<PropertyMetaNumber, "max" | "min">): string | undefined {
  return useProperty((property) => {
    if (property.meta?.type !== "number") return undefined;
    return property.meta[field]?.toString() || undefined;
  });
}

export function usePropertyMetaNumberIntegerToggle(): {
  isActive: boolean;
  handleToggle: () => void;
} {
  const propertyId = usePropertyId();
  const { updateProperty } = usePropertyStore().getState();
  const isActive = useProperty((p) => p.meta?.type === "number" && p.meta.integer);

  const handleToggle = useCallback(() => {
    updateProperty(propertyId, (draft) => {
      if (draft.meta?.type !== "number") return;
      draft.meta.integer = !draft.meta.integer;
    });
  }, [propertyId, updateProperty]);

  return {
    isActive: isActive ?? false,
    handleToggle,
  };
}

/**
 * Input Hooks
 */

export function usePropertyMetaNumberMaxInputControlled(variant?: string): {
  inputId: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
} {
  return usePropertyMetaNumberInputControlled("max", variant);
}

export function usePropertyMetaNumberMinInputControlled(variant?: string): {
  inputId: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
} {
  return usePropertyMetaNumberInputControlled("min", variant);
}

export function usePropertyMetaNumberMaxInputUncontrolled(variant?: string): {
  inputId: string;
  placeholder: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  defaultValue: string;
} {
  return usePropertyMetaNumberInputUncontrolled("max", variant);
}

export function usePropertyMetaNumberMinInputUncontrolled(variant?: string): {
  inputId: string;
  placeholder: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  defaultValue: string;
} {
  return usePropertyMetaNumberInputUncontrolled("min", variant);
}

/**
 * Base Input Hooks
 */
export function usePropertyMetaNumberInputControlled(
  field: keyof Pick<PropertyMetaNumber, "max" | "min">,
  variant?: string,
): {
  inputId: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
} {
  const base = usePropertyMetaInputBase(field, variant);
  const value = usePropertyMetaNumberDisplay(field) || "";

  return {
    ...base,
    value,
  };
}

export function usePropertyMetaNumberInputUncontrolled(
  field: keyof Pick<PropertyMetaNumber, "max" | "min">,
  variant?: string,
): {
  inputId: string;
  placeholder: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  defaultValue: string;
} {
  const base = usePropertyMetaInputBase(field, variant);

  const inputRef = useRef<HTMLInputElement>(null);
  const store = usePropertyStore();
  const propertyId = usePropertyId();

  const defaultValue = useMemo(() => {
    const property = store.getState().properties[propertyId];
    if (property?.meta?.type !== "number") return "";
    return property.meta[field]?.toString() || "";
  }, [store, propertyId, field]);

  return {
    ...base,
    inputRef,
    defaultValue,
  };
}

function usePropertyMetaInputBase(
  field: keyof Pick<PropertyMetaNumber, "max" | "min">,
  variant?: string,
): {
  inputId: string;
  placeholder: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
} {
  const { t } = useCMSTranslations();

  const propertyId = usePropertyId();
  const store = usePropertyStore();

  // Input ID for accessibility
  const inputId = useMemo(() => {
    return generateInputId("property-meta-number", propertyId, field.toString(), variant);
  }, [propertyId, field, variant]);

  // Placeholder text using translations
  const placeholder = useMemo(() => {
    const fieldTranslationKey = `property.meta.number.${field.toString()}.label`;
    return t(fieldTranslationKey);
  }, [t, field]);

  // Change handler with translation update
  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value.trim();
      store.getState().updateProperty(propertyId, (draft) => {
        // Preserve object reference, only update specific locale
        if (draft.meta?.type !== "number") {
          console.warn("Property meta type is not number", draft.meta);
          return;
        }
        draft.meta[field] = Number(value);
      });
    },
    [store, propertyId, field],
  );

  return {
    inputId,
    placeholder,
    onChange,
  };
}
