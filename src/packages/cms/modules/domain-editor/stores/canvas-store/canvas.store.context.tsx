"use client";

import { createContext, useRef, useEffect } from "react";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";
import { Property } from "@cms/modules/properties/property.types";
import { createCanvasStore, CanvasStoreReturnType } from "./canvas.store";

export const CanvasStoreContext = createContext<CanvasStoreReturnType | null>(null);

export const CanvasStoreProvider = ({
  domainId,
  locale,
  initialProperties = [],
  children,
}: {
  domainId: string;
  locale: string;
  initialProperties?: Property[];
  children: React.ReactNode;
}) => {
  useDebugRender("CanvasStoreProvider");
  const storeRef = useRef<CanvasStoreReturnType | null>(null);

  if (storeRef.current === null) {
    // Create store with initial properties (normal behavior)
    storeRef.current = createCanvasStore(domainId, locale, initialProperties);
  }

  // After hydration, check for conflicts between persisted and fresh data
  useEffect(() => {
    if (storeRef.current && initialProperties.length > 0) {
      const store = storeRef.current.getState();

      // Wait for hydration to complete before checking conflicts
      if (store.hasHydrated) {
        store.detectConflict(initialProperties);
      } else {
        // If not hydrated yet, wait for hydration
        const unsubscribe = storeRef.current.subscribe((state) => {
          if (state.hasHydrated) {
            state.detectConflict(initialProperties);
            unsubscribe(); // Only run once after hydration
          }
        });

        return unsubscribe;
      }
    }
  }, [initialProperties]);

  return <CanvasStoreContext.Provider value={storeRef.current}>{children}</CanvasStoreContext.Provider>;
};
