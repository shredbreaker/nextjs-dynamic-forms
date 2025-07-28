"use client";

import { useContext, ReactNode } from "react";
import { LayoutStoreContext } from "./layout.store.context";

export function useLayoutStore() {
  const store = useContext(LayoutStoreContext);
  if (!store) {
    throw new Error("useLayoutStore must be used within a LayoutStoreProvider");
  }
  return store;
}

export function useLayoutStoreHydration(): boolean {
  const store = useLayoutStore();
  return store((state) => state.hasHydrated);
}

// Hydration helper for layout store
export function LayoutStoreHydrated({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  const hasHydrated = useLayoutStoreHydration();

  if (!hasHydrated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
