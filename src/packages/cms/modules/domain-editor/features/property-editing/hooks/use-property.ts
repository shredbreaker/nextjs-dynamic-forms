import { useCallback } from "react";
import { CanvasStore } from "@cms/modules/domain-editor/stores/canvas-store/canvas.store";
import { useCanvasStore } from "@cms/modules/domain-editor/stores/canvas-store/canvas.store.hooks";
import { makeFormProperty } from "@cms/modules/domain-editor/utils/new-property.utils";
import { FormProperty } from "@cms/modules/properties/form/types";

/**
 * @fileoverview Property CRUD Operations Hook
 *
 * 🎯 PURPOSE: Centralized CRUD operations for properties
 *
 * 🏗️ ARCHITECTURE DECISIONS:
 * - Consolidates scattered property operations into consistent hook
 * - Follows same pattern as usePropertyOptionCRUD for consistency
 * - Provides clean API for property management
 * - Uses canvas store for all property operations
 *
 * 🤖 AI GUIDANCE - Property CRUD Usage:
 * ✅ USE for all property creation, updating, deletion operations
 * ✅ REPLACE direct store.getState() calls with hook methods
 * ✅ CONSISTENT API across all property editing components
 * ✅ CENTRALIZED logic for property operations
 *
 * ❌ NEVER call store methods directly for property operations
 * ❌ NEVER duplicate CRUD logic across components
 * ❌ NEVER manage property state locally
 */

/**
 * 🛠️ Property CRUD Hook - Centralized property operations
 *
 * Provides consolidated CRUD operations for properties, replacing scattered
 * direct store calls throughout the codebase.
 *
 * @returns Object with property CRUD operations
 *
 * @example
 * ```tsx
 * const { addProperty, updateProperty, deleteProperty, cloneProperty } = usePropertyCRUD();
 *
 * // Add new property
 * addProperty();
 *
 * // Update property
 * updateProperty(propertyId, (draft) => {
 *   draft.name.en = "New Name";
 * });
 *
 * // Delete property
 * deleteProperty(propertyId);
 *
 * // Clone property
 * cloneProperty(propertyId);
 * ```
 */
export function usePropertyCRUD(): {
  addProperty: () => void;
  updateProperty: (propertyId: string, updater: (draft: FormProperty) => void) => void;
  deleteProperty: (propertyId: string) => void;
  cloneProperty: (propertyId: string) => void;
} {
  const store = useCanvasStore();

  /**
   * 🆕 Add Property - Creates new property with default values
   */
  const addProperty = useCallback(() => {
    const newProperty = makeFormProperty();
    store.getState().addProperty(newProperty);
  }, [store]);

  /**
   * 📝 Update Property - Updates property with draft function
   */
  const updateProperty = useCallback(
    (propertyId: string, updater: (draft: FormProperty) => void) => {
      store.getState().updateProperty(propertyId, updater);
    },
    [store],
  );

  /**
   * 🗑️ Delete Property - Removes property and all its options
   */
  const deleteProperty = useCallback(
    (propertyId: string) => {
      store.getState().deleteProperty(propertyId);
    },
    [store],
  );

  /**
   * 📋 Clone Property - Creates copy of existing property
   */
  const cloneProperty = useCallback(
    (propertyId: string) => {
      store.getState().cloneProperty(propertyId);
    },
    [store],
  );

  return {
    addProperty,
    updateProperty,
    deleteProperty,
    cloneProperty,
  };
}

/**
 * 🏷️ Get Single Property - Hook to get individual property with reactive updates
 */
export function useProperty(propertyId: string): FormProperty | undefined {
  const store = useCanvasStore();

  const selector = useCallback((state: CanvasStore) => state.properties[propertyId], [propertyId]);

  return store(selector);
}

/**
 * 📋 Get All Properties - Hook to get all properties with reactive updates
 */
export function useProperties(): Record<string, FormProperty> {
  const store = useCanvasStore();

  const selector = useCallback((state: CanvasStore) => state.properties, []);

  return store(selector);
}
