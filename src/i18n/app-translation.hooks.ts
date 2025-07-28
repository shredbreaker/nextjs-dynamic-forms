"use client";

import { useMemo } from "react";
import { useGenericTranslations, type Translator } from "@shared-ui/i18n/generic-translation.hooks"; // Adjusted path
// Removed: useTranslations, useLocale, TranslationValues from next-intl as they are now handled by the generic hook.

export function useAppTranslations(subNamespace?: string): {
  t: Translator;
  tCurrent: Translator; // For default CMS translations
  tDefault: Translator; // For fallback CMS translations
  formatCMSDate: (date: string) => string;
} {
  const genericTranslations = useGenericTranslations("app", subNamespace);

  return useMemo(
    () => ({
      t: genericTranslations.t,
      tCurrent: genericTranslations.tCurrent,
      tDefault: genericTranslations.tDefault,
      formatCMSDate: genericTranslations.formatDate,
    }),
    [genericTranslations],
  );
}

// Re-export Translator if it was intended to be available from this module
export type { Translator };
