"use client";

import { createContext, useRef } from "react";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";
import { createLayoutStore, LayoutStoreReturnType } from "./layout.store";

export const LayoutStoreContext = createContext<LayoutStoreReturnType | null>(null);

export const LayoutStoreProvider = ({ locale, children }: { locale: string; children: React.ReactNode }) => {
  useDebugRender("LayoutStoreProvider");
  const storeRef = useRef<LayoutStoreReturnType | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createLayoutStore(locale);
  }

  return <LayoutStoreContext.Provider value={storeRef.current}>{children}</LayoutStoreContext.Provider>;
};
