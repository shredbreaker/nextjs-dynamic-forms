"use client";

import { useLocale } from "next-intl";
import { createContext, useContext, ReactNode } from "react";

interface CustomLocaleContextValue {
  customLocale: string;
}

const CustomLocaleContext = createContext<CustomLocaleContextValue | null>(null);

export function CustomLocaleProvider({ customLocale, children }: { customLocale?: string; children: ReactNode }) {
  const defaultLocale = useLocale();
  const contextValue = {
    customLocale: customLocale || defaultLocale,
  };

  return <CustomLocaleContext.Provider value={contextValue}>{children}</CustomLocaleContext.Provider>;
}

export function useCustomLocale(): string {
  const context = useContext(CustomLocaleContext);
  const fallbackLocale = useLocale();

  return context?.customLocale || fallbackLocale;
}
