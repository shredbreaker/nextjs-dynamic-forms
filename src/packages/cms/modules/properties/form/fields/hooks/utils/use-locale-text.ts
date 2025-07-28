"use client";

import { useLocale } from "next-intl";
import { useMemo, useCallback, useRef } from "react";
import { LocalizedText } from "@cms-data/modules/localization/localization.types";
import { useCMSTranslations } from "@cms/i18n/use-cms-translation.hooks";
import { useCustomLocale } from "@cms/modules/localization/hooks/use-custom-locale";
import { getAvailableLocalizedText } from "@cms/modules/localization/utils/get-available-localized-text";
import { useProperty, usePropertyId, usePropertyStore } from "@cms/modules/properties/form/hooks";
import type { FormProperty } from "@cms/modules/properties/form/types";
import { generateInputId } from "@cms/modules/shared/form/utils/input-id.utils";

export function usePropertyLocaleTextDisplay(field: keyof FormProperty, locale?: string): string | undefined {
  const currentLocale = useLocale();
  const customLocale = useCustomLocale();

  // ✅ FIX: If locale is explicitly passed, use it. Otherwise use context hierarchy
  const targetLocale = locale || customLocale || currentLocale;

  const property = useProperty((property) => {
    const fieldValue = property[field] as Record<string, string> | undefined;
    return fieldValue?.[targetLocale] || "";
  });

  return property;
}

export function usePropertyLocaleTextInputControlled(
  field: keyof FormProperty,
  variant?: string,
): {
  inputId: string;
  value: string;
  placeholder: string;
  targetLocale: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
} {
  const base = usePropertyLocaleTextInputBase(field, variant);
  const value = usePropertyLocaleTextDisplay(field, base.targetLocale) || "";

  return {
    ...base,
    value,
  };
}

export function usePropertyLocaleTextInputUncontrolled(
  field: keyof FormProperty,
  locale?: string,
): {
  inputId: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  placeholder: string;
  defaultValue: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
} {
  const base = usePropertyLocaleTextInputBase(field, undefined, locale);
  const inputRef = useRef<HTMLInputElement>(null);
  const defaultValue = usePropertyLocaleTextDisplay(field, base.targetLocale) || "";

  return {
    ...base,
    inputRef,
    defaultValue,
  };
}

function usePropertyLocaleTextInputBase(
  field: keyof FormProperty,
  variant?: string,
  forceLocale?: string,
): {
  inputId: string;
  placeholder: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  targetLocale: string;
} {
  const currentLocale = useLocale();
  const customLocale = useCustomLocale();
  const targetLocale = forceLocale || customLocale || currentLocale;

  const propertyId = usePropertyId();
  const store = usePropertyStore();
  const { updateProperty } = store.getState();

  // Input ID for accessibility
  const inputId = useMemo(() => {
    return generateInputId("property", propertyId, field.toString(), variant, targetLocale);
  }, [propertyId, field, variant, targetLocale]);

  const placeholder =
    useProperty((property) => {
      const fieldValue = property[field] as LocalizedText | undefined;
      return getAvailableLocalizedText(fieldValue, targetLocale);
    }) || "";

  // Change handler with translation update
  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value.trim();
      updateProperty(propertyId, (draft) => {
        // Preserve object reference, only update specific locale
        const translationField = draft[field] as Record<string, string> | undefined;
        if (!translationField) {
          (draft[field] as Record<string, string>) = { [targetLocale]: value };
        } else {
          translationField[targetLocale] = value;
        }
      });
    },
    [updateProperty, propertyId, field, targetLocale],
  );

  return {
    inputId,
    placeholder,
    onChange,
    targetLocale,
  };
}
