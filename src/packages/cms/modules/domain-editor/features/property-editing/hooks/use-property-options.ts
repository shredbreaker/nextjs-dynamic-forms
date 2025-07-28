"use client";

import { useCallback, useMemo, useRef } from "react";
import { generateUUID } from "@shared-ui/lib/utils";
import { CanvasStore } from "@cms/modules/domain-editor/stores/canvas-store/canvas.store";
import { useCanvasStore } from "@cms/modules/domain-editor/stores/canvas-store/canvas.store.hooks";
import { PropertyOption } from "@cms/modules/properties/property.types";

// Stable empty object reference to avoid infinite loops
const EMPTY_OPTIONS = {};

// Custom hook for option input following the usePropertyInput pattern
export function usePropertyOptionInput(options: {
  propertyId: string;
  optionId: string;
  getValue: (option: PropertyOption | undefined, locale?: string) => string;
  setValue: (optionId: string, locale: string, value: string) => void;
  locale?: string;
}): {
  inputRef: React.RefObject<HTMLInputElement | null>;
  defaultValue: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
} {
  const { propertyId, optionId, getValue, setValue, locale } = options;
  const store = useCanvasStore();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const memoizedSelector = useCallback(
    (state: CanvasStore) => {
      const option = state.propertyOptions[propertyId]?.[optionId];
      return getValue(option, locale);
    },
    [propertyId, optionId, getValue, locale],
  );

  const initialValue = store(memoizedSelector) || "";

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      // Apply 255 character limit
      const trimmedValue = newValue.substring(0, 255);
      setValue(optionId, locale || "", trimmedValue);
    },
    [optionId, locale, setValue],
  );

  return {
    inputRef,
    defaultValue: initialValue,
    onChange: handleChange,
  };
}

/**
 * Hook to get all options for a property sorted by display_order
 */
export function useOrderedPropertyOptions(propertyId: string): PropertyOption[] {
  const store = useCanvasStore();

  // Get raw options object from store (stable reference when options don't change)
  const optionsObj = store(
    useCallback((state: CanvasStore) => state.propertyOptions[propertyId] || EMPTY_OPTIONS, [propertyId]),
  );

  // Sort in useMemo to avoid creating new array on every render
  return useMemo(() => {
    return Object.values(optionsObj).sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
  }, [optionsObj]);
}

/**
 * Helper function to get max display_order for a property's options
 */
function getMaxDisplayOrder(options: Record<string, PropertyOption>): number {
  const orders = Object.values(options).map((option) => option.display_order || 0);
  return orders.length > 0 ? Math.max(...orders) : -1;
}

/**
 * Hook that provides CRUD operations for property options
 */
export function usePropertyOptionCRUD(propertyId: string): {
  addPropertyOption: () => void;
  clonePropertyOption: (sourceOptionId: string) => void;
  deletePropertyOption: (optionId: string) => void;
  reorderPropertyOptions: (sourceIndex: number, destinationIndex: number) => void;
  updateOptionName: (optionId: string, locale: string, name: string) => void;
  updateOptionCode: (optionId: string, code: string) => void;
} {
  const store = useCanvasStore();

  const addPropertyOption = useCallback(() => {
    store.getState().updatePropertyOptions(propertyId, (draft) => {
      // Check 100 option limit
      const currentCount = Object.keys(draft).length;
      if (currentCount >= 100) {
        console.warn(`Cannot add more than 100 options to property ${propertyId}`);
        return;
      }

      const newOption: PropertyOption = {
        option_id: generateUUID(),
        property_id: propertyId,
        name: {}, // Empty localized object
        display_order: getMaxDisplayOrder(draft) + 1,
        code: "", // Empty code
        is_new: true,
      };

      draft[newOption.option_id] = newOption;
    });
  }, [propertyId, store]);

  const clonePropertyOption = useCallback(
    (sourceOptionId: string) => {
      store.getState().updatePropertyOptions(propertyId, (draft) => {
        const sourceOption = draft[sourceOptionId];
        if (!sourceOption) {
          console.warn(`Source option ${sourceOptionId} not found`);
          return;
        }

        // Check 100 option limit
        const currentCount = Object.keys(draft).length;
        if (currentCount >= 100) {
          console.warn(`Cannot add more than 100 options to property ${propertyId}`);
          return;
        }

        const clonedOption: PropertyOption = {
          ...sourceOption,
          option_id: generateUUID(), // New UUID
          is_new: true,
        };

        // Set display_order to be right after the original option
        const originalOrder = sourceOption.display_order || 0;

        // Shift all options after the original one position down
        Object.keys(draft).forEach((optionId) => {
          if ((draft[optionId].display_order || 0) > originalOrder) {
            draft[optionId].display_order = (draft[optionId].display_order || 0) + 1;
          }
        });

        // Insert clone right after original
        clonedOption.display_order = originalOrder + 1;

        draft[clonedOption.option_id] = clonedOption;
      });
    },
    [propertyId, store],
  );

  const deletePropertyOption = useCallback(
    (optionId: string) => {
      store.getState().updatePropertyOptions(propertyId, (draft) => {
        delete draft[optionId];
        // No need to reorder other options - preserve their display_order values
      });
    },
    [propertyId, store],
  );

  const reorderPropertyOptions = useCallback(
    (sourceIndex: number, destinationIndex: number) => {
      store.getState().updatePropertyOptions(propertyId, (draft) => {
        // Get current ordered option IDs
        const orderedOptions = Object.values(draft).sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

        if (
          sourceIndex < 0 ||
          sourceIndex >= orderedOptions.length ||
          destinationIndex < 0 ||
          destinationIndex >= orderedOptions.length
        ) {
          console.warn(`Invalid reorder indices: ${sourceIndex} -> ${destinationIndex}`);
          return;
        }

        // Reorder the array
        const [movedOption] = orderedOptions.splice(sourceIndex, 1);
        orderedOptions.splice(destinationIndex, 0, movedOption);

        // Update display_order values
        orderedOptions.forEach((option, index) => {
          draft[option.option_id].display_order = index;
        });
      });
    },
    [propertyId, store],
  );

  const updateOptionName = useCallback(
    (optionId: string, locale: string, name: string) => {
      store.getState().updatePropertyOptions(propertyId, (draft) => {
        const option = draft[optionId];
        if (!option) {
          console.warn(`Option ${optionId} not found`);
          return;
        }

        if (!option.name) {
          option.name = {};
        }

        // Trim whitespace and apply 255 character limit
        const trimmedName = name.trim().substring(0, 255);
        option.name[locale] = trimmedName;
      });
    },
    [propertyId, store],
  );

  const updateOptionCode = useCallback(
    (optionId: string, code: string) => {
      store.getState().updatePropertyOptions(propertyId, (draft) => {
        const option = draft[optionId];
        if (!option) {
          console.warn(`Option ${optionId} not found`);
          return;
        }

        // Trim whitespace and apply 255 character limit
        const trimmedCode = code.trim().substring(0, 255);
        option.code = trimmedCode;
      });
    },
    [propertyId, store],
  );

  return {
    addPropertyOption,
    clonePropertyOption,
    deletePropertyOption,
    reorderPropertyOptions,
    updateOptionName,
    updateOptionCode,
  };
}

/**
 * Hook to get the count of options for a property
 */
export function usePropertyOptionCount(propertyId: string): number {
  const store = useCanvasStore();

  const selector = useCallback(
    (state: CanvasStore) => Object.keys(state.propertyOptions[propertyId] || {}).length,
    [propertyId],
  );

  return store(selector);
}

/**
 * Hook to check if property has reached the maximum option limit
 */
export function usePropertyOptionLimitReached(propertyId: string): boolean {
  const count = usePropertyOptionCount(propertyId);
  return count >= 100;
}
