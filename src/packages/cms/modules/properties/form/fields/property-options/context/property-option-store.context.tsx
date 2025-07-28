"use client";

import { type ReactNode, createContext } from "react";
import { StoreApi } from "zustand";
import type { PropertyStore } from "@cms/modules/properties/form/stores/property.store";

// ✅ Type definition for our store API
export type PropertyStoreApi = StoreApi<PropertyStore>;

// ✅ Store Context
export const PropertyStoreContext = createContext<PropertyStoreApi | null>(null);

// ✅ Store Provider - only accepts an external store
export interface PropertyStoreProviderProps {
  children: ReactNode;
  store: PropertyStoreApi;
}

export const PropertyStoreProvider = ({ children, store }: PropertyStoreProviderProps) => {
  return <PropertyStoreContext.Provider value={store}>{children}</PropertyStoreContext.Provider>;
};
