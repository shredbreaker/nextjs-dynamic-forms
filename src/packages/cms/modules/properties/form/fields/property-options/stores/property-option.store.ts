import { produce } from "immer";
import { StateCreator } from "zustand";
import type { FormProperty } from "@cms/modules/properties/form/types";

// ✅ Property Store State & Actions Types
export interface PropertyStoreState {
  properties: Record<string, FormProperty>;
}

export interface PropertyStoreActions {
  updateProperty: (id: string, updater: (draft: FormProperty) => void) => void;
}

export type PropertyStore = PropertyStoreState & PropertyStoreActions;

// ✅ STORE CREATOR - Following Zustand patterns (like counterStoreCreator)
export const createPropertyStore: StateCreator<PropertyStore> = (set) => ({
  // Initial state
  properties: {},

  // Actions
  updateProperty: (id: string, updater: (draft: FormProperty) => void) =>
    set(
      produce((state: PropertyStore) => {
        if (state.properties[id]) {
          updater(state.properties[id]);
        }
      }),
    ),
});
