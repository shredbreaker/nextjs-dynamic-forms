"use client";

import { createContext, useContext, useState, useMemo } from "react";

export type EditDomainContextState = {
  isDevMode: boolean;
  setDevMode: (isDevMode: boolean) => void;
};

export const EditDomainContext = createContext<EditDomainContextState | null>(null);

export function EditDomainProvider({ children }: { children: React.ReactNode }) {
  const [isDevMode, setDevMode] = useState(false);

  const contextValue = useMemo(
    () => ({
      isDevMode,
      setDevMode,
    }),
    [isDevMode],
  );

  return <EditDomainContext.Provider value={contextValue}>{children}</EditDomainContext.Provider>;
}

export function useEditDomainContext() {
  const context = useContext(EditDomainContext);
  if (!context) {
    throw new Error("useEditDomainContext must be used within a EditDomainProvider");
  }
  return context;
}
