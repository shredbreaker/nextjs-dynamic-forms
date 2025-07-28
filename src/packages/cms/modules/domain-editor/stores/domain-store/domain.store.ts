/**
 * @fileoverview Domain Store - Domain data management store
 *
 * 🎯 PURPOSE: Manages domain data, status, and change tracking
 *
 * 🏗️ ARCHITECTURE DECISIONS:
 * - Separates domain concerns from property data (canvas-store)
 * - Uses domain-specific persistence keys for multi-domain support
 * - Tracks changes for save/publish status indicators
 * - Optimized with Immer for efficient immutable updates
 *
 * 🤖 AI GUIDANCE - Store Usage Rules:
 * ✅ USE for domain data operations (name, status, metadata)
 * ✅ USE for tracking domain changes and publish status
 * ✅ USE for domain form state management
 * ✅ PREFER specific selectors over full state subscriptions
 *
 * ❌ NEVER use for property data (use canvas-store instead)
 * ❌ NEVER mix domain and property concerns in same store
 * ❌ NEVER use for UI state (toggles, language) - use layout-store instead
 *
 * 🔐 PERSISTENCE:
 * - Key: `domain-store-${domainId}` (domain-specific)
 * - Persists: domain data, hasChanges flag
 * - Excludes: originalDomain (source of truth), hasHydrated (runtime)
 *
 * 📚 REFERENCE: See docs/architecture/domain-editor/hook-patterns.md
 */
"use client";

import { produce } from "immer";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Domain } from "@cms/modules/domains/domain.types";

/**
 * 🔄 Hydration state tracking
 */
export type DomainStoreHydration = {
  hasHydrated: boolean;
};

/**
 * 📊 Domain data state
 */
export type DomainStoreState = {
  domainId: string;
  domain: Domain | null;
  originalDomain: Domain | null;
  isFormOpen: boolean;
};

/**
 * ⚙️ Domain operations
 */
export type DomainStoreActions = {
  setDomain: (domain: Domain) => void;
  updateDomain: (updater: (draft: Domain) => void) => void;
  reset: () => void;
  openForm: () => void;
  closeForm: () => void;
  setPublished: (isPublished: boolean) => void;
};

/**
 * 🎯 Complete store interface
 */
export type DomainStore = DomainStoreHydration & DomainStoreState & DomainStoreActions;

/**
 * 🏭 Domain Store Factory
 *
 * Creates domain-specific store with persistence and hydration
 *
 * @param domainId - Domain identifier for store isolation
 * @param initialDomain - Server-provided initial domain data
 * @returns Configured Zustand store instance
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export function createDomainStore(domainId: string, initialDomain: Domain | null) {
  return create<DomainStore>()(
    persist(
      (set) => ({
        hasHydrated: false,
        domainId,
        domain: initialDomain,
        originalDomain: initialDomain,
        isFormOpen: false,

        /**
         * 📝 Set domain data completely
         */
        setDomain: (domain: Domain) =>
          set({
            domain,
          }),

        /**
         * 📝 Update domain using Immer draft
         */
        updateDomain: (updater: (draft: Domain) => void) =>
          set(
            produce((state) => {
              if (state.domain) {
                updater(state.domain);
              }
            }),
          ),

        /**
         * 🔄 Reset to original domain state
         */
        reset: () =>
          set((state) => ({
            domain: state.originalDomain,
          })),

        /**
         * 🔓 Open domain form
         */
        openForm: () => set({ isFormOpen: true }),

        /**
         * 🔒 Close domain form
         */
        closeForm: () => set({ isFormOpen: false }),

        /**
         * 📢 Set published status
         */
        setPublished: (isPublished: boolean) =>
          set(
            produce((state) => {
              if (state.domain) {
                state.domain.is_active = isPublished;
              }
            }),
          ),
      }),
      {
        name: `domain-store-${domainId}`,
        partialize: (state) => ({
          domain: state.domain,
        }),
        onRehydrateStorage: () => (state) => {
          if (state) {
            state.hasHydrated = true;
          }
        },
      },
    ),
  );
}

export type DomainStoreType = ReturnType<typeof createDomainStore>;
