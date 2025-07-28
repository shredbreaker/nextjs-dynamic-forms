import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale;
  const currentLocale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  const defaultLocale = routing.defaultLocale; // e.g., 'en'

  // Load current locale's base messages
  const currentBaseMessages = (await import(`./messages/${currentLocale}.json`)).default;
  let currentCmsMessages = {};
  try {
    currentCmsMessages = (await import(`../packages/cms/i18n/messages/${currentLocale}.json`)).default;
  } catch (error) {
    console.warn(`[CMS i18n] Could not load current locale messages for '${currentLocale}'.`, error);
  }

  // Load default locale's messages if different from current
  let defaultBaseMessages = {};
  let defaultCmsMessages = {};
  if (currentLocale !== defaultLocale) {
    try {
      defaultBaseMessages = (await import(`./messages/${defaultLocale}.json`)).default;
      defaultCmsMessages = (await import(`../packages/cms/i18n/messages/${defaultLocale}.json`)).default;
    } catch (error) {
      console.warn(`[CMS i18n] Could not load default locale messages for '${defaultLocale}'.`, error);
    }
  } else {
    // If current is default, just use the already loaded messages
    defaultBaseMessages = currentBaseMessages;
    defaultCmsMessages = currentCmsMessages;
  }

  const result = {
    locale: currentLocale, // Still report the actual current locale
    messages: {
      app: currentBaseMessages, // Or keep at root if preferred
      cms: currentCmsMessages,
      default: {
        app: defaultBaseMessages,
        cms: defaultCmsMessages,
      },
    },
  };

  return result;
});
