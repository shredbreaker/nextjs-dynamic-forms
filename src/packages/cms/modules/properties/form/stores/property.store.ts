import { produce } from "immer";
import { StateCreator } from "zustand";
import { generateUUID } from "@shared-ui/lib/utils";
import type { FormProperty } from "@cms/modules/properties/form/types";

// ✅ Property Store State & Actions Types
export interface PropertyStoreState {
  properties: Record<string, FormProperty>;
  hasChanged: boolean;
  deletedPropertyIds: string[];
}

export interface PropertyStoreActions {
  addProperty: (property: FormProperty) => void;
  updateProperty: (id: string, updater: (draft: FormProperty) => void) => void;
  deleteProperty: (id: string) => void;
  cloneProperty: (id: string) => void;
}

export type PropertyStore = PropertyStoreState & PropertyStoreActions;

// ✅ STORE CREATOR - Following Zustand patterns (like counterStoreCreator)
export const createPropertyStore: StateCreator<PropertyStore> = (set) => ({
  // Initial state
  properties: {},
  hasChanged: false,
  deletedPropertyIds: [],

  // Actions
  updateProperty: (id: string, updater: (draft: FormProperty) => void) =>
    set(
      produce((state: PropertyStore) => {
        if (state.properties[id]) {
          updater(state.properties[id]);
        }
      }),
    ),

  addProperty: (property: FormProperty) =>
    set(
      produce((state) => {
        state.properties[property.id] = property;

        // const maxOrder = Math.max(...(Object.values(state.ordering) as number[]), -1);
        // state.ordering[property.id] = maxOrder + 1;

        // state.propertyOptions[property.id] = {};
        state.hasChanged = true;
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

        // // Track option IDs for deletion if they're from the database
        // if (state.propertyOptions[id]) {
        //   const options = Object.values(state.propertyOptions[id]) as PropertyOption[];
        //   options.forEach((option) => {
        //     if (!option.is_new) {
        //       state.deletedOptionIds.push(option.option_id);
        //     }
        //   });
        // }

        // Clean up all references
        delete state.properties[id];
        // delete state.ordering[id];
        // delete state.propertyOptions[id];
        state.hasChanged = true;
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
        // state.ordering[clonedProperty.id] = originalOrder + 1;

        // Initialize empty property options for the clone
        // state.propertyOptions[clonedProperty.id] = {};

        // If original had options, clone them too
        // if (state.propertyOptions[id]) {
        //   state.propertyOptions[clonedProperty.id] = { ...state.propertyOptions[id] };
        // }
        state.hasChanged = true;
      }),
    ),
});
