"use client";

import { createContext, useRef } from "react";
import { Domain } from "@cms/modules/domains/domain.types";
import { createDomainStore, DomainStoreType } from "./domain.store";

export const DomainStoreContext = createContext<DomainStoreType | null>(null);

export interface DomainStoreProviderProps {
  initialDomain: Domain;
  children: React.ReactNode;
}

export function DomainStoreProvider({
  initialDomain,
  children,
}: DomainStoreProviderProps): React.JSX.Element {
  const storeRef = useRef<DomainStoreType | null>(null);

  if (!storeRef.current) {
    storeRef.current = createDomainStore(initialDomain.id, initialDomain);
  }

  return <DomainStoreContext.Provider value={storeRef.current}>{children}</DomainStoreContext.Provider>;
}

