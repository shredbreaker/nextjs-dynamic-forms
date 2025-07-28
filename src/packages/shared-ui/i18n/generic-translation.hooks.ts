"use client";

import { useTranslations, useLocale } from "next-intl";
import type { TranslationValues } from "next-intl";
import { useMemo } from "react";

// Define a type for the translation function for clarity
type Translator = (key: string, values?: TranslationValues) => string;

// Helper to create a safe translator with fallback and logging
const createSafeTranslator = (
  actualTranslator: ReturnType<typeof useTranslations>,
  logContext: { localeIdentifier: string; namespace: string },
): Translator => {
  return (key: string, values?: TranslationValues): string => {
    try {
      return actualTranslator(key, values);
    } catch (error) {
      console.warn(
        `[Generic Translation System Error] Locale: '${logContext.localeIdentifier}', Namespace: '${logContext.namespace}', Key: '${key}'. Falling back to key.`,
        values ? `Values: ${JSON.stringify(values)}` : "",
        `Error: ${error instanceof Error ? error.message : String(error)}`,
      );
      return key;
    }
  };
};

export function useGenericTranslations(
  primaryNamespace: string,
  subNamespace?: string,
): {
  t: Translator;
  tCurrent: Translator;
  tDefault: Translator;
  formatDate: (date: string) => string;
} {
  const currentLocale = useLocale();
  const currentFullNamespace = subNamespace ? `${primaryNamespace}.${subNamespace}` : primaryNamespace;
  const defaultFullNamespace = subNamespace
    ? `default.${primaryNamespace}.${subNamespace}`
    : `default.${primaryNamespace}`;

  const tForCurrentLocaleProvider = useTranslations(currentFullNamespace);
  const tForDefaultLocaleProvider = useTranslations(defaultFullNamespace);

  return useMemo(() => {
    const tCurrent = createSafeTranslator(tForCurrentLocaleProvider, {
      localeIdentifier: currentLocale,
      namespace: currentFullNamespace,
    });

    const tDefault = createSafeTranslator(tForDefaultLocaleProvider, {
      localeIdentifier: "default",
      namespace: defaultFullNamespace,
    });

    const t: Translator = (key: string, values?: TranslationValues): string => {
      const currentLocaleTranslation = tCurrent(key, values);
      if (currentLocaleTranslation !== `${currentFullNamespace}.${key}`) {
        return currentLocaleTranslation;
      }
      return tDefault(key, values);
    };

    return {
      t,
      tCurrent,
      tDefault,
      formatDate: (date: string) => {
        return new Intl.DateTimeFormat(currentLocale).format(new Date(date));
      },
    };
  }, [currentLocale, currentFullNamespace, defaultFullNamespace, tForCurrentLocaleProvider, tForDefaultLocaleProvider]);
}

// It might be beneficial to export the Translator type if it's used elsewhere.
export type { Translator };
