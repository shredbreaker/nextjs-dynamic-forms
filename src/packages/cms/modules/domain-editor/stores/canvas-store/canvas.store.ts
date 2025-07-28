/**
 * @fileoverview Canvas Store - Property data management store
 *
 * 🎯 PURPOSE: Manages all property data, options, and CRUD operations
 *
 * 🏗️ ARCHITECTURE DECISIONS:
 * - Separates data concerns from UI (see layout-store for UI state)
 * - Uses domain-specific persistence keys for multi-domain support
 * - Optimized with Immer for efficient immutable updates
 * - Strategic hydration boundaries in components (not individual wrappers)
 *
 * 🤖 AI GUIDANCE - Store Usage Rules:
 * ✅ USE for all property data operations (CRUD, options, ordering)
 * ✅ USE reactive hooks (usePropertyDisplay, useReactiveValue) for live updates
 * ✅ USE static reads (store.getState()) for form initial values only
 * ✅ PREFER specific selectors over full state subscriptions
 *
 * ❌ NEVER use for UI state (toggles, language) - use layout-store instead
 * ❌ NEVER wrap individual components with hydration - use strategic boundaries
 * ❌ NEVER mix data and UI concerns in same store
 *
 * 🚨 DATA INTEGRITY WARNINGS:
 * ⚠️ ALWAYS track deletions (deletedPropertyIds, deletedOptionIds)
 * ⚠️ NEVER skip save parameters (properties, options, deletions)
 * ⚠️ NEVER use shared domain IDs in tests (causes state pollution)
 * ⚠️ ALWAYS use unique domain IDs for test isolation
 *
 * 🔐 PERSISTENCE:
 * - Key: `property-store-${domainId}` (domain-specific)
 * - Persists: properties, propertyOptions, ordering, domainId
 * - Excludes: dbProperties (source of truth), hasHydrated (runtime)
 *
 * 📚 REFERENCE: See docs/architecture/domain-editor/hook-patterns.md
 */
"use client";

export * from "./canvas.store.hooks";
export * from "./canvas.store.context";

import { produce } from "immer";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { generateUUID } from "@shared-ui/lib/utils";
import { FormProperty } from "@cms/modules/properties/form/types";
import { Property, PropertyOption } from "@cms/modules/properties/property.types";

/**
 * 🔄 Hydration state tracking
 */
export type CanvasStoreHydration = {
  hasHydrated: boolean;
};

/**
 * 📊 Core property data state
 */
export type CanvasStoreState = {
  domainId: string;
  dbProperties: Property[];
  properties: Record<string, FormProperty>;
  propertyOptions: Record<string, Record<string, PropertyOption>>;
  ordering: Record<string, number>; // UUID: Index
  hasChanged: boolean; // Track if property schema has changed
  deletedPropertyIds: string[]; // Track deleted properties that existed in DB
  deletedOptionIds: string[]; // Track deleted options that existed in DB
  resetKey: string; // Force component re-render on reset
  hasDataConflict: boolean; // Track if DB data changed while editing
  conflictData: Property[] | null; // The newer DB data causing conflict
};

/**
 * ⚙️ Property CRUD operations
 */
export type CanvasStoreActions = {
  addProperty: (property: FormProperty) => void;
  cloneProperty: (id: string) => void;
  deleteProperty: (id: string) => void;
  updateProperty: (id: string, updater: (draft: FormProperty) => void) => void;
  updatePropertyOptions: (propertyId: string, updater: (draft: Record<string, PropertyOption>) => void) => void;
  deletePropertyOption: (propertyId: string, optionId: string) => void;
  reset: () => void;
  reorderProperties: (sourceIndex: number, destinationIndex: number) => void;
  setup: (properties: Property[]) => void;
  detectConflict: (newDbProperties: Property[]) => void;
  resolveConflict: (action: "refresh" | "cancel") => void;
};

/**
 * 🎯 Complete store interface
 */
export type CanvasStore = CanvasStoreHydration & CanvasStoreState & CanvasStoreActions;

/**
 * 🏭 Canvas Store Factory
 *
 * Creates domain-specific property store with persistence and hydration
 *
 * @param domainId - Domain identifier for store isolation
 * @param currentLocale - Initial locale setting
 * @param initialProperties - Server-provided initial property data
 * @returns Configured Zustand store instance
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export function createCanvasStore(domainId: string, currentLocale: string, initialProperties: Property[]) {
  /**
   * 🔧 Helper: Transform server properties to store format
   */
  const buildInitialState = (
    properties: Property[],
  ): Pick<
    CanvasStoreState,
    | "dbProperties"
    | "properties"
    | "propertyOptions"
    | "ordering"
    | "deletedPropertyIds"
    | "deletedOptionIds"
    | "hasChanged"
    | "resetKey"
    | "hasDataConflict"
    | "conflictData"
  > => {
    const state = {
      dbProperties: properties,
      properties: {} as Record<string, FormProperty>,
      propertyOptions: {} as Record<string, Record<string, PropertyOption>>,
      ordering: {} as Record<string, number>,
      deletedPropertyIds: [] as string[],
      deletedOptionIds: [] as string[],
      hasChanged: false,
      resetKey: generateUUID(),
      hasDataConflict: false,
      conflictData: null,
    };

    // Map properties to the state
    (properties ?? []).forEach((property, index) => {
      const { display_order, options, ...propertyWithoutDisplayOrder } = property;

      // Convert Property to FormProperty format by adding is_new flag
      const formProperty: FormProperty = {
        ...propertyWithoutDisplayOrder,
        is_new: property.is_new || false, // Ensure is_new exists
      };

      state.ordering[property.id] = display_order || index;
      state.properties[property.id] = formProperty;

      // Initialize options for this property (even if empty)
      state.propertyOptions[property.id] = {};
      if (options?.length) {
        state.propertyOptions[property.id] = Object.fromEntries(options.map((option) => [option.option_id, option]));
      }
    });
    return state;
  };

  /**
   * 🔧 Helper: Check if current state differs from database state
   *
   * 🚨 CRITICAL: This function determines when user has unsaved changes
   * Incorrect implementation can lead to data loss in conflict scenarios
   */
  const checkHasChanged = (state: CanvasStoreState): boolean => {
    if (!state) return false;

    // If we have tracked deletions, we have changes
    if (state.deletedPropertyIds.length > 0 || state.deletedOptionIds.length > 0) {
      return true;
    }

    // Check if any property is new
    const hasNewProperties = Object.values(state.properties).some((prop) => prop.is_new);
    if (hasNewProperties) {
      return true;
    }

    // Check if any options are new
    const hasNewOptions = Object.values(state.propertyOptions).some((options) =>
      Object.values(options).some((option) => option.is_new),
    );
    if (hasNewOptions) {
      return true;
    }

    // Check if number of properties changed
    if (Object.keys(state.properties).length !== state.dbProperties.length) {
      return true;
    }

    // Deep comparison for existing properties to detect modifications
    // Compare each current property with its original DB version
    for (const [id, currentProperty] of Object.entries(state.properties)) {
      const dbProperty = state.dbProperties.find((p) => p.id === id);
      if (!dbProperty) {
        // Property exists in current but not in DB (shouldn't happen if is_new is correct)
        return true;
      }

      // Compare key fields to detect changes
      if (
        JSON.stringify(currentProperty.name) !== JSON.stringify(dbProperty.name) ||
        JSON.stringify(currentProperty.description) !== JSON.stringify(dbProperty.description) ||
        currentProperty.code !== dbProperty.code ||
        currentProperty.is_required !== dbProperty.is_required ||
        currentProperty.is_private !== dbProperty.is_private ||
        currentProperty.is_locked !== dbProperty.is_locked ||
        currentProperty.type !== dbProperty.type ||
        JSON.stringify(currentProperty.meta) !== JSON.stringify(dbProperty.meta)
      ) {
        return true;
      }
    }

    // Compare ordering changes
    for (const [id, currentOrder] of Object.entries(state.ordering)) {
      const dbProperty = state.dbProperties.find((p) => p.id === id);
      if (dbProperty && (dbProperty.display_order || 0) !== currentOrder) {
        return true;
      }
    }

    // If we get here, no changes detected
    return false;
  };

  return create<CanvasStore>()(
    persist(
      (set) => ({
        hasHydrated: false,
        domainId: domainId,
        ...buildInitialState(initialProperties),

        /**
         * 📝 Update single property using Immer draft
         */
        updateProperty: (id: string, updater: (draft: FormProperty) => void) =>
          set(
            produce((state) => {
              if (state.properties[id]) {
                updater(state.properties[id]);
                state.hasChanged = checkHasChanged(state);
              }
            }),
          ),

        /**
         * 🎛️ Update property options using Immer draft
         */
        updatePropertyOptions: (propertyId: string, updater: (draft: Record<string, PropertyOption>) => void) =>
          set(
            produce((state) => {
              if (!state.propertyOptions[propertyId]) {
                state.propertyOptions[propertyId] = {};
              }
              updater(state.propertyOptions[propertyId]);
              state.hasChanged = checkHasChanged(state);
            }),
          ),

        /**
         * ➕ Add new property with auto-ordering
         */
        addProperty: (property: FormProperty) =>
          set(
            produce((state) => {
              state.properties[property.id] = property;

              const maxOrder = Math.max(...(Object.values(state.ordering) as number[]), -1);
              state.ordering[property.id] = maxOrder + 1;

              state.propertyOptions[property.id] = {};
              state.hasChanged = checkHasChanged(state);
            }),
          ),

        /**
         * 🗑️ Delete property and cleanup related data
         *
         * 🚨 CRITICAL: Must safely handle property deletion and track for DB deletion
         */
        deleteProperty: (id: string) =>
          set(
            produce((state) => {
              // Safely check if property exists and track for deletion if it's from DB
              const property = state.properties[id];
              if (property && !property.is_new) {
                state.deletedPropertyIds.push(id);
              }

              // Track option IDs for deletion if they're from the database
              if (state.propertyOptions[id]) {
                const options = Object.values(state.propertyOptions[id]) as PropertyOption[];
                options.forEach((option) => {
                  if (!option.is_new) {
                    state.deletedOptionIds.push(option.option_id);
                  }
                });
              }

              // Clean up all references
              delete state.properties[id];
              delete state.ordering[id];
              delete state.propertyOptions[id];
              state.hasChanged = checkHasChanged(state);
            }),
          ),

        /**
         * 📋 Clone property with new ID and adjusted ordering
         */
        cloneProperty: (id: string) =>
          set(
            produce((state) => {
              const originalProperty = state.properties[id];
              if (!originalProperty) return;

              // Create a deep copy of the property
              const clonedProperty: FormProperty = {
                ...originalProperty,
                id: generateUUID(),
                is_new: true,
              };

              // Add to properties
              state.properties[clonedProperty.id] = clonedProperty;

              // Set ordering to be right after the original property
              const originalOrder = state.ordering[id];

              // Shift all properties after the original one position down
              Object.keys(state.ordering).forEach((propertyId) => {
                if (state.ordering[propertyId] > originalOrder) {
                  state.ordering[propertyId] += 1;
                }
              });

              // Insert clone right after original
              state.ordering[clonedProperty.id] = originalOrder + 1;

              // Initialize empty property options for the clone
              state.propertyOptions[clonedProperty.id] = {};

              // If original had options, clone them too
              if (state.propertyOptions[id]) {
                state.propertyOptions[clonedProperty.id] = { ...state.propertyOptions[id] };
              }
              state.hasChanged = checkHasChanged(state);
            }),
          ),

        /**
         * 🔄 Reset to original server state
         */
        reset: () =>
          set((state) => {
            return {
              ...state,
              ...buildInitialState(state.dbProperties),
              domainId: state.domainId,
              hasHydrated: state.hasHydrated,
              resetKey: generateUUID(), // Force component re-render
            };
          }),

        setup: (properties: Property[]) =>
          set((state) => {
            return {
              ...state,
              ...buildInitialState(properties),
              domainId: state.domainId,
              hasHydrated: state.hasHydrated,
            };
          }),

        /**
         * 🗑️ Delete property option and track for database deletion
         */
        deletePropertyOption: (propertyId: string, optionId: string) =>
          set(
            produce((state) => {
              if (state.propertyOptions[propertyId]?.[optionId]) {
                // Track for deletion if it's not a new option (only once!)
                if (!state.propertyOptions[propertyId][optionId].is_new) {
                  state.deletedOptionIds.push(optionId);
                }

                // Remove from store
                delete state.propertyOptions[propertyId][optionId];
                state.hasChanged = checkHasChanged(state);
              }
            }),
          ),

        /**
         * 🔀 Reorder properties efficiently
         */
        reorderProperties: (sourceIndex: number, destinationIndex: number) =>
          set(
            produce((state) => {
              // Get current ordered IDs
              const orderedIds = Object.entries(state.ordering)
                .sort(([, a], [, b]) => (a as number) - (b as number))
                .map(([id]) => id);

              // Reorder array
              const [movedId] = orderedIds.splice(sourceIndex, 1);
              orderedIds.splice(destinationIndex, 0, movedId);

              // Single atomic update - most efficient
              state.ordering = Object.fromEntries(orderedIds.map((id, index) => [id, index]));
              state.hasChanged = checkHasChanged(state);
            }),
          ),

        /**
         * 🔍 Detect data conflicts between current and new DB properties
         */
        detectConflict: (newDbProperties: Property[]) =>
          set((state) => {
            const currentDbProperties = state.dbProperties;

            // If no current DB properties in store, this is initial load - proceed normally
            if (currentDbProperties.length === 0) {
              return {
                ...state,
                ...buildInitialState(newDbProperties),
                domainId: state.domainId,
                hasHydrated: state.hasHydrated,
              };
            }

            // Compare current DB properties with new DB properties
            const currentJson = JSON.stringify(currentDbProperties);
            const newJson = JSON.stringify(newDbProperties);
            const dbDataChanged = currentJson !== newJson;

            if (dbDataChanged) {
              // DB data has changed - check if user has unsaved edits
              if (state.hasChanged) {
                // User has unsaved changes - show conflict dialog
                return {
                  ...state,
                  hasDataConflict: true,
                  conflictData: newDbProperties,
                };
              } else {
                // No unsaved changes - automatically update to new data
                return {
                  ...state,
                  ...buildInitialState(newDbProperties),
                  domainId: state.domainId,
                  hasHydrated: state.hasHydrated,
                };
              }
            }

            // No DB changes - just update dbProperties reference, keep all form state
            return {
              ...state,
              dbProperties: newDbProperties,
            };
          }),

        /**
         * 🔧 Resolve data conflict based on user choice
         */
        resolveConflict: (action: "refresh" | "cancel") =>
          set((state) => {
            if (action === "refresh" && state.conflictData) {
              // Accept new data, reset all changes
              const newState = {
                ...state,
                ...buildInitialState(state.conflictData),
                domainId: state.domainId,
                hasHydrated: state.hasHydrated,
                hasDataConflict: false,
                conflictData: null,
              };

              return newState;
            }

            // Cancel - just clear conflict state, keep working with current data
            return {
              ...state,
              hasDataConflict: false,
              conflictData: null,
            };
          }),
      }),
      {
        name: `property-store-${domainId}`,
        partialize: (state) => ({
          domainId: state.domainId,
          properties: state.properties,
          propertyOptions: state.propertyOptions,
          ordering: state.ordering,
          deletedOptionIds: state.deletedOptionIds,
          hasChanged: state.hasChanged,
          resetKey: state.resetKey,
          dbProperties: state.dbProperties,
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

export type CanvasStoreReturnType = ReturnType<typeof createCanvasStore>;
