"use client";

import { createContext, useContext, useMemo, useState } from "react";

export type NewDomainContextState = {
  isDevMode: boolean;
  setDevMode: (isDevMode: boolean) => void;
};

export const NewDomainContext = createContext<NewDomainContextState | null>(null);

export function NewDomainProvider({ children }: { children: React.ReactNode }) {
  const [isDevMode, setDevMode] = useState(false);

  const contextValue = useMemo(
    () => ({
      isDevMode,
      setDevMode,
    }),
    [isDevMode],
  );

  return <NewDomainContext.Provider value={contextValue}>{children}</NewDomainContext.Provider>;
}

export function useNewDomainContext() {
  const context = useContext(NewDomainContext);
  if (!context) {
    throw new Error("useNewDomainContext must be used within a NewDomainProvider");
  }
  return context;
}
