import { getGenericServerTranslations } from "@shared-ui/i18n/generic-translation.server"; // Adjust path as needed
import type { GenericServerTranslationsResult } from "@shared-ui/i18n/generic-translation.server";
import { DEFAULT_LOCALE } from "./supported-locales";
// Re-export or define types if needed by consuming code

export async function getTranslations({
  subNamespace,
}: {
  locale?: string;
  subNamespace?: string;
}): Promise<GenericServerTranslationsResult> {
  return getGenericServerTranslations({
    defaultLocale: DEFAULT_LOCALE,
    primaryNamespace: "app",
    subNamespace,
  });
}
