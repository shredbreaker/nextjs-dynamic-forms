"use client";

import { useMemo, createContext, useContext } from "react";
import { useGenericTranslations, type Translator } from "@shared-ui/i18n/generic-translation.hooks";

export const CMSTranslationContext = createContext<CMSTranslationContextType | null>(null);

export type CMSTranslationContextType = {
  t: Translator;
  tCurrent: Translator;
  tDefault: Translator;
  formatCMSDate: (date: string) => string;
};

export function CMSTranslationContextProvider({
  namespace,
  children,
}: {
  namespace: string;
  children: React.ReactNode;
}) {
  const { t, tCurrent, tDefault, formatDate } = useGenericTranslations("cms", namespace);

  const value = useMemo(
    () => ({ t, tCurrent, tDefault, formatCMSDate: formatDate }),
    [t, tCurrent, tDefault, formatDate],
  );

  return <CMSTranslationContext.Provider value={value}>{children}</CMSTranslationContext.Provider>;
}

export function useCMSTranslations(): CMSTranslationContextType {
  const context = useContext(CMSTranslationContext);
  if (!context) {
    throw new Error("useCMSTranslations must be used within a CMSTranslationContextProvider");
  }
  return context;
}

// Re-export Translator if it was intended to be available from this module
export type { Translator };
