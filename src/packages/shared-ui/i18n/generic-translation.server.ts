import type { TranslationValues } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";

// Define a type for the translation function for clarity
type Translator = (key: string, values?: TranslationValues) => Promise<string>;
// Note: getTranslations returns a Promise, so Translator returns Promise<string>

export type GenericServerTranslationsResult = {
  t: Translator;
  tCurrent: Translator;
  tDefault: Translator;
  formatDate: (date: string | Date, options?: Intl.DateTimeFormatOptions) => string;
};

// This function provides a structured way to get translation functions on the server.
export async function getGenericServerTranslations({
  defaultLocale,
  primaryNamespace,
  subNamespace,
}: {
  defaultLocale: string;
  primaryNamespace: string;
  subNamespace?: string;
}): Promise<GenericServerTranslationsResult> {
  const locale = await getLocale();

  const currentFullNamespace = subNamespace ? `${primaryNamespace}.${subNamespace}` : primaryNamespace;
  const defaultFullNamespace = subNamespace
    ? `default.${primaryNamespace}.${subNamespace}`
    : `default.${primaryNamespace}`;

  // Helper to create a translator for a specific locale and namespace
  const createTranslator = (targetLocale: string, namespace: string): Translator => {
    return async (key: string, values?: TranslationValues): Promise<string> => {
      try {
        // getTranslations can be called with a specific namespace
        const tInstance = await getTranslations({ locale: targetLocale, namespace });
        if (!tInstance.has(key)) {
          return key;
        }
        return tInstance(key, values);
      } catch (error) {
        console.warn(
          `[Generic Server Translation Error] Locale: '${targetLocale}', Namespace: '${namespace}', Key: '${key}'. Falling back to key.`,
          values ? `Values: ${JSON.stringify(values)}` : "",
          `Error: ${error instanceof Error ? error.message : String(error)}`,
        );
        return key;
      }
    };
  };

  const tCurrent = createTranslator(locale, currentFullNamespace);
  const tDefault = createTranslator(defaultLocale, defaultFullNamespace);

  const t: Translator = async (key: string, values?: TranslationValues): Promise<string> => {
    const currentLocaleTranslation = await tCurrent(key, values);

    const tInstanceCurrent = await getTranslations({ locale, namespace: currentFullNamespace });
    if (tInstanceCurrent.has(key)) {
      const tInstanceCurrentRaw = tInstanceCurrent.raw(key);

      if (tInstanceCurrentRaw !== `${currentFullNamespace}.${key}`) {
        return currentLocaleTranslation;
      }
    }

    console.warn(
      `[Generic Server Translation Error] Locale: '${locale}', Namespace: '${currentFullNamespace}', Key: '${key}'. Falling back to key.`,
      values ? `Values: ${JSON.stringify(values)}` : "",
    );

    return tDefault(key, values);
  };

  return {
    t,
    tCurrent,
    tDefault,
    formatDate: (date: string | Date, options?: Intl.DateTimeFormatOptions) => {
      return new Intl.DateTimeFormat(locale, options).format(new Date(date));
    },
  };
}
