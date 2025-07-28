"use client";

import { useMemo, useCallback, useRef } from "react";
import { useCMSTranslations } from "@cms/i18n/use-cms-translation.hooks";
import { usePropertyId, usePropertyStore, useProperty } from "@cms/modules/properties/form/hooks";
import { generateInputId } from "@cms/modules/shared/form/utils/input-id.utils";

export function usePropertyMetaTextMaxDisplay(): string | undefined {
  return useProperty((property) => {
    if (property.meta?.type !== "text") return undefined;
    return property.meta.max?.toString() || undefined;
  });
}

export const usePropertyMetaTextMultilineToggle = (): {
  isActive: boolean;
  handleToggle: () => void;
} => {
  const propertyId = usePropertyId();
  const store = usePropertyStore();
  const { updateProperty } = store.getState();
  const isActive = useProperty((p) => p.meta?.type === "text" && p.meta.multiline);

  const handleToggle = useCallback(() => {
    updateProperty(propertyId, (draft) => {
      if (draft.meta?.type !== "text") return;
      draft.meta.multiline = !draft.meta.multiline;
    });
  }, [propertyId, updateProperty]);

  return {
    isActive: isActive ?? false,
    handleToggle,
  };
};

/**
 * Controlled Input Hooks
 */
export function usePropertyMetaTextMaxInputControlled(variant?: string): {
  inputId: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
} {
  const base = usePropertyMetaTextMaxInputBase(variant);
  const value = usePropertyMetaTextMaxDisplay() || "";

  return {
    ...base,
    value,
  };
}

export function usePropertyMetaTextMaxInputUncontrolled(variant?: string): {
  inputId: string;
  placeholder: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  defaultValue: string;
} {
  const base = usePropertyMetaTextMaxInputBase(variant);

  const inputRef = useRef<HTMLInputElement>(null);
  const store = usePropertyStore();
  const propertyId = usePropertyId();

  const defaultValue = useMemo(() => {
    const property = store.getState().properties[propertyId];
    if (property?.meta?.type !== "text") return "";
    return property.meta.max?.toString() || "";
  }, [store, propertyId]);

  return {
    ...base,
    inputRef,
    defaultValue,
  };
}

function usePropertyMetaTextMaxInputBase(variant?: string): {
  inputId: string;
  placeholder: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
} {
  const { t } = useCMSTranslations();

  const propertyId = usePropertyId();
  const store = usePropertyStore();

  // Input ID for accessibility
  const inputId = useMemo(() => {
    return generateInputId("property-meta-text", propertyId, "max", variant);
  }, [propertyId, variant]);

  // Placeholder text using translations
  const placeholder = useMemo(() => {
    const fieldTranslationKey = `property.meta.text.max.label`;
    return t(fieldTranslationKey);
  }, [t]);

  // Change handler with translation update
  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value.trim();
      store.getState().updateProperty(propertyId, (draft) => {
        // Preserve object reference, only update specific locale
        if (draft.meta?.type !== "text") {
          console.warn("Property meta type is not text", draft.meta);
          return;
        }
        draft.meta.max = Number(value);
      });
    },
    [store, propertyId],
  );

  return {
    inputId,
    placeholder,
    onChange,
  };
}
