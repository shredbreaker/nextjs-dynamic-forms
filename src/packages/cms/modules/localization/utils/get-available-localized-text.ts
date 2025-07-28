import { LocalizedText } from "@cms-data/modules/localization/localization.types";
import { DEFAULT_LOCALE } from "@cms/i18n/supported-locales";

/*
 Returns available value based on locale, default locale, first key, or undefined
 locale -> default locale -> first key -> undefined
*/
export function getAvailableLocalizedText(localizedText: LocalizedText | undefined | null, locale: string): string {
  if (!localizedText) return "";
  if (typeof localizedText !== "object") return "";
  if (localizedText[locale]) return localizedText[locale] || "";
  if (localizedText[DEFAULT_LOCALE]) return localizedText[DEFAULT_LOCALE] || "";

  const keys = Object.keys(localizedText);
  if (keys.length === 0) return "";

  return localizedText[keys[0]] || "";
}
