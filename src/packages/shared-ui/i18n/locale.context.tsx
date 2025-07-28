"use client";

import { createContext, useContext } from "react";

export type LocalizationContextType = {
  locales: string[];
  defaultLocale: string;
  pathname: string;
  routeParams: Record<string, string | string[] | undefined>;
  switchLocale: (newLocale: string) => void;
};

export const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const useLocalization = () => {
  const ctx = useContext(LocalizationContext);
  if (!ctx) throw new Error("useLocalization must be used within LocalizationProvider");
  return ctx;
};
