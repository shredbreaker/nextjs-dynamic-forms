import { US, TH, RU } from "country-flag-icons/react/3x2";
import React from "react";
import { LOCALES, DEFAULT_LOCALE } from "@/i18n/supported-locales";

// Flag components for easy access by hooks and components
export const FLAGS: Record<string, React.ComponentType<{ className?: string; title?: string }>> = {
  en: US,
  ru: RU,
  th: TH,
};

// Helper function to get flag component by locale
export const getFlagComponent = (locale: string): React.ComponentType<{ className?: string; title?: string }> => {
  return FLAGS[locale] || FLAGS[DEFAULT_LOCALE];
};

// Type for locale codes
export type LocaleType = (typeof LOCALES)[number];

interface FlagProps {
  locale: LocaleType;
  className?: string;
  size?: number;
}

export const LocalizedFlag: React.FC<FlagProps> = ({ locale, className = "w-6 h-4", size }) => {
  const FlagComponent = getFlagComponent(locale);

  const sizeProps = size ? { width: size, height: size * 0.67 } : {};

  return <FlagComponent className={className} title={`Flag of ${locale}`} {...sizeProps} />;
};

// Hook example for easy flag access
export const useFlag = (locale: LocaleType) => {
  return React.useMemo(
    () => ({
      component: FLAGS[locale] || FLAGS.en,
      getFlagComponent: () => getFlagComponent(locale),
    }),
    [locale],
  );
};

export default LocalizedFlag;
