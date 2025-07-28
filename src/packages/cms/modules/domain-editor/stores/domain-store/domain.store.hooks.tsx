/**
 * @fileoverview Domain Store Hooks - Access domain store state
 *
 * 🎯 PURPOSE: Provides hooks for accessing domain store state
 *
 * 🏗️ ARCHITECTURE DECISIONS:
 * - Follows store hooks pattern from canvas-store
 * - Provides hydration boundary for client components
 * - Ensures type safety with proper TypeScript definitions
 *
 * 🤖 AI GUIDANCE - Hook Usage Rules:
 * ✅ USE useDomainStore for reactive state access
 * ✅ USE DomainStoreHydrated for hydration boundaries
 * ✅ PREFER specific selectors for performance
 *
 * ❌ NEVER use store outside DomainStoreProvider
 * ❌ NEVER skip hydration boundaries for client components
 *
 * 📚 REFERENCE: See docs/architecture/domain-editor/hook-patterns.md
 */
"use client";

import React, { useContext, ReactNode } from "react";
import { DomainStore, DomainStoreType } from "./domain.store";
import { DomainStoreContext } from "./domain.store.context";

/**
 * 🎣 useDomainStore - Access domain store state
 *
 * Hook for accessing the domain store state with proper context validation.
 * Follows the same pattern as useCanvasStore.
 *
 * @returns Domain store instance
 * @throws Error if used outside DomainStoreProvider
 */
export function useDomainStore<T>(selector: (state: DomainStore) => T): T;
export function useDomainStore(): DomainStoreType;
export function useDomainStore<T>(selector?: (state: DomainStore) => T) {
  const store = useContext(DomainStoreContext);
  if (!store) {
    throw new Error("useDomainStore must be used within a DomainStoreProvider");
  }

  if (!selector) {
    return store;
  }

  return store(selector);
}

export function useDomainStoreHydration(): boolean {
  const store = useDomainStore();
  return store((state) => state.hasHydrated);
}

// Simple helper like ClientOnly but for domain store hydration
export function DomainStoreHydrated({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  const hasHydrated = useDomainStoreHydration();

  if (!hasHydrated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
