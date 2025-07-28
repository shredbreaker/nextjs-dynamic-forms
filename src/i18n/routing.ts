import { defineRouting } from "next-intl/routing";
import { LOCALES, DEFAULT_LOCALE } from "./supported-locales";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: LOCALES,

  // Used when no locale matches
  defaultLocale: DEFAULT_LOCALE,
});
