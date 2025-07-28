/**
 * @fileoverview Layout Store - UI state management store
 *
 * 🎯 PURPOSE: Manages UI-specific state separate from property data
 *
 * 🏗️ ARCHITECTURE DECISIONS:
 * - Separates UI concerns from data (see canvas-store for data)
 * - Handles language, toggles, and layout preferences
 * - Non-persistent UI state (resets on page reload)
 * - Optimized for UI reactivity without affecting data operations
 *
 * 🤖 AI GUIDANCE - Layout Store Usage:
 * ✅ USE for UI state (language, toggles, layout preferences)
 * ✅ USE reactive selectors for UI components
 * ✅ SEPARATE from data operations (use canvas-store for data)
 * ✅ KEEP UI state lightweight and responsive
 *
 * ❌ NEVER store property data here (use canvas-store instead)
 * ❌ NEVER persist UI state (intentionally session-only)
 * ❌ NEVER mix data and UI concerns in same operations
 *
 * 🎛️ UI STATE MANAGED:
 * - Current translation/language selection
 * - Toggle states (tree, settings, preview, etc.)
 * - Layout preferences and display modes
 *
 * 📚 REFERENCE: See docs/architecture/domain-editor/hook-patterns.md
 */

"use client";

export * from "./layout.store.hooks";
export * from "./layout.store.context";

import { produce } from "immer";
import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * 🔄 Hydration state tracking for layout store
 */
export type LayoutStoreHydration = {
  hasHydrated: boolean;
};

/**
 * 🎛️ UI Mode Toggle States and Actions
 */
export type LayoutStoreMode = {
  /** Show property code inputs */
  showPropertyCode: boolean;
  /** Show advanced property settings */
  showAdvancedSettings: boolean;
  /** Show property preview panel */
  showPreview: boolean;
  /** Show properties tree navigation */
  showPropertiesTree: boolean;
  /** Show language selection bar */
  showLanguageBar: boolean;

  rearrangeToggleActive: boolean;
  showDebugCard: boolean;
  /** Toggle property code visibility */
  setShowPropertyCode: (show: boolean) => void;
  /** Toggle advanced settings visibility */
  setShowAdvancedSettings: (show: boolean) => void;
  /** Toggle preview panel visibility */
  setShowPreview: (show: boolean) => void;
  /** Toggle properties tree visibility */
  setShowPropertiesTree: (show: boolean) => void;
  /** Toggle language bar visibility */
  setShowLanguageBar: (show: boolean) => void;

  setRearrangeToggleActive: (active: boolean) => void;
  setShowDebugCard: (active: boolean) => void;
};

/**
 * 🌐 Translation and Locale Management
 */
export type LayoutStoreTranslation = {
  /** Current system locale */
  currentLocale: string;
  /** Currently selected translation for editing */
  currentTranslation: string;
  /** Set the active translation language */
  setCurrentTranslation: (locale: string) => void;
};

/**
 * 🎯 Complete Layout Store Interface
 */
export type LayoutStore = LayoutStoreHydration & LayoutStoreMode & LayoutStoreTranslation;

export type LayoutStoreReturnType = ReturnType<typeof createLayoutStore>;

/**
 * 🏭 Layout Store Factory - Creates UI state management store
 *
 * Creates a Zustand store for managing UI-specific state that is separate from
 * property data. Handles toggles, language selection, and layout preferences.
 *
 * @param currentLocale - Initial locale from Next.js useLocale()
 * @returns Configured Zustand store for layout state
 *
 * @example
 * ```tsx
 * const layoutStore = createLayoutStore("en");
 * const showTree = layoutStore(state => state.showPropertiesTree);
 * ```
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export function createLayoutStore(currentLocale: string) {
  return create<LayoutStore>()(
    persist(
      (set) => ({
        hasHydrated: false,

        // 🎛️ Mode state - UI toggles
        showPropertyCode: false,
        showAdvancedSettings: false,
        showPreview: false,
        showPropertiesTree: false,
        showLanguageBar: false,
        rearrangeToggleActive: false,
        showDebugCard: false,
        // 🌐 Translation state
        currentLocale: currentLocale,
        currentTranslation: currentLocale,

        // 🎛️ Mode actions - Toggle UI elements
        setShowPropertyCode: (show: boolean) => set({ showPropertyCode: show }),
        setShowAdvancedSettings: (show: boolean) => set({ showAdvancedSettings: show }),
        setShowPropertiesTree: (show: boolean) => set({ showPropertiesTree: show }),
        setRearrangeToggleActive: (active: boolean) => set({ rearrangeToggleActive: active }),
        setShowPreview: (show: boolean) => set({ showPreview: show, showDebugCard: false }),
        setShowDebugCard: (show: boolean) => set({ showDebugCard: show, showPreview: false }),
        /**
         * 🌐 Language Bar Toggle - Smart translation reset
         * When hiding language bar, resets translation to system locale
         */
        setShowLanguageBar: (show: boolean) =>
          set(
            produce((state) => {
              state.showLanguageBar = show;
              if (!show) {
                state.currentTranslation = state.currentLocale;
              }
            }),
          ),

        // 🌐 Translation actions
        setCurrentTranslation: (locale: string) => set({ currentTranslation: locale }),
      }),
      {
        name: "canvas-layout-store", // Global, not domain-specific
        partialize: (state) => ({
          showPropertyCode: state.showPropertyCode,
          showAdvancedSettings: state.showAdvancedSettings,
          showPreview: state.showPreview,
          showPropertiesTree: state.showPropertiesTree,
          showLanguageBar: state.showLanguageBar,
          rearrangeToggleActive: state.rearrangeToggleActive,
          showDebugCard: state.showDebugCard,
          currentTranslation: state.currentTranslation,
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
