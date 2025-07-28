/**
 * @fileoverview Property Hooks - Core hooks for property data access and manipulation
 *
 * 🎯 PURPOSE: Provides optimized hooks for different property access patterns
 *
 * 🏗️ ARCHITECTURE DECISIONS:
 * - Multiple hook types for different use cases (display, forms, settings)
 * - Performance optimization through selective reactivity
 * - Clear naming that indicates behavior (static vs reactive vs controlled)
 *
 * 🤖 AI GUIDANCE - Hook Selection Rules:
 * ✅ USE `usePropertyDisplay` → Reactive read-only for tree names, previews
 * ✅ USE `useStaticProperty` → One-time reads for form initial values
 * ✅ USE `useUncontrolledInput` → Most form inputs (hybrid approach)
 * ✅ USE `useControlledInput` → When you need immediate reactive updates
 * ✅ USE `useReactiveValue` → Settings with reactive updates + setValue
 *
 * ❌ NEVER use static hooks for display components that need updates
 * ❌ NEVER use reactive hooks where static would work
 *
 * 📚 REFERENCE: See docs/architecture/domain-editor/hook-patterns.md
 *
 * ✅ Hooks now have clear semantic naming for different patterns
 */
"use client";

import { useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { PropertyRowContext } from "@cms/modules/domain-editor/contexts";
import { CanvasStore } from "@cms/modules/domain-editor/stores/canvas-store/canvas.store";
import { useCanvasStore } from "@cms/modules/domain-editor/stores/canvas-store/canvas.store.hooks";
import { FormProperty } from "@cms/modules/properties/form/types";
import { PropertyOption } from "@cms/modules/properties/property.types";

/**
 * 🔧 INTERNAL: Generic reactive property selector
 *
 * @internal Use through public hooks, not directly
 * @param id - Property ID to select from
 * @param selector - Function to extract data from property
 * @returns Selected value with reactive updates
 */
function useProperty<T>(id: string, selector: (property: FormProperty) => T): T | undefined {
  const store = useCanvasStore();

  const memoizedSelector = useCallback(
    (state: CanvasStore) => {
      const property = state.properties[id];
      return property ? selector(property) : undefined;
    },
    [id, selector],
  );

  return store(memoizedSelector);
}

/**
 * 🤖 AI GUIDANCE: Use for form initial values only
 * ❌ NOT for display components that need updates
 * ✅ GOOD: <input defaultValue={useStaticProperty({...})} />
 *
 * @param options.getValue - Function to extract value from property
 * @param options.locale - Optional locale for localized values
 * @returns String value (static, no updates)
 */
export function useStaticProperty(options: {
  getValue: (property: FormProperty, locale?: string) => string;
  locale?: string;
}): string {
  const { getValue, locale } = options;
  const { propertyId } = useContext(PropertyRowContext)!;
  const store = useCanvasStore();

  // Use static read for initial value instead of reactive subscription for better performance
  const property = store.getState().properties[propertyId];
  const value = property ? getValue(property, locale) : "";

  return value;
}

/**
 * 🤖 AI GUIDANCE: Hybrid form inputs (uncontrolled)
 * ✅ GOOD: Most form inputs that need initial value + onChange
 * Uses static read for initial, reactive for changes
 *
 * @param options.getValue - Function to extract value from property
 * @param options.setValue - Function to update property value
 * @param options.locale - Optional locale for localized values
 * @returns Object with inputRef, defaultValue, and onChange handler
 */
export function useUncontrolledInput(options: {
  getValue: (property: FormProperty, locale?: string) => string;
  setValue: (draft: FormProperty, value: string, locale?: string) => void;
  locale?: string;
}): {
  inputRef: React.RefObject<HTMLInputElement | null>;
  defaultValue: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
} {
  const { getValue, setValue, locale } = options;
  const { propertyId } = useContext(PropertyRowContext)!;
  const store = useCanvasStore();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      store.getState().updateProperty(propertyId, (draft) => {
        setValue(draft, newValue, locale);
      });
    },
    [propertyId, setValue, locale, store],
  );

  const initialValue = getValue(store.getState().properties[propertyId] || {}, locale) || "";

  return {
    inputRef,
    defaultValue: initialValue,
    onChange: handleChange,
  };
}

/**
 * 🤖 AI GUIDANCE: Controlled form inputs (full reactive)
 * ✅ GOOD: When you need full control over input value
 * ❌ NOT needed in most cases - use useUncontrolledInput instead
 *
 * @param options.getValue - Function to extract value from property
 * @param options.setValue - Function to update property value
 * @param options.locale - Optional locale for localized values
 * @returns Object with inputRef, reactive value, and onChange handler
 */
export function useControlledInput(options: {
  getValue: (property: FormProperty, locale?: string) => string;
  setValue: (draft: FormProperty, value: string, locale?: string) => void;
  locale?: string;
}): {
  inputRef: React.RefObject<HTMLInputElement | null>;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
} {
  const { getValue, setValue, locale } = options;
  const { propertyId } = useContext(PropertyRowContext)!;
  const store = useCanvasStore();
  const inputRef = useRef<HTMLInputElement>(null);

  const selector = useCallback((property: FormProperty) => getValue(property, locale), [getValue, locale]);
  const currentValue = useProperty(propertyId, selector) || "";

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      store.getState().updateProperty(propertyId, (draft) => {
        setValue(draft, newValue, locale);
      });
    },
    [propertyId, setValue, locale, store],
  );

  useEffect(() => {
    if (inputRef.current && inputRef.current.value !== currentValue) {
      inputRef.current.value = currentValue;
    }
  }, [currentValue]);

  return {
    inputRef,
    value: currentValue,
    onChange: handleChange,
  };
}

/**
 * 🤖 AI GUIDANCE: Reactive value with setter (for settings)
 * ✅ GOOD: Settings components that need reactive updates + setValue
 * ❌ NOT for read-only display - use usePropertyDisplay instead
 *
 * @param options.getValue - Function to extract value from property
 * @param options.setValue - Function to update property value
 * @returns Object with reactive value and setter function
 */
export function useReactiveValue<T>(options: {
  getValue: (property: FormProperty) => T;
  setValue: (draft: FormProperty, value: T) => void;
}): { value: T | null; setValue: (value: T) => void } {
  const { getValue, setValue } = options;
  const { propertyId } = useContext(PropertyRowContext)!;
  const store = useCanvasStore();

  const selector = useCallback((property: FormProperty) => getValue(property), [getValue]);
  const currentValue = useProperty(propertyId, selector) || null;

  const handleChange = useCallback(
    (value: T) => {
      store.getState().updateProperty(propertyId, (draft) => {
        setValue(draft, value);
      });
    },
    [propertyId, setValue, store],
  );

  return {
    value: currentValue,
    setValue: handleChange,
  };
}

/**
 * 🤖 AI GUIDANCE: Reactive property options access
 * ✅ GOOD: When you need all options for a property with reactive updates
 *
 * @param propertyId - Property ID to get options for
 * @returns Record of all property options with reactive updates
 */
export function usePropertyOptions(propertyId: string): Record<string, PropertyOption> {
  const store = useCanvasStore();

  const selector = useCallback((state: CanvasStore) => state.propertyOptions[propertyId] || {}, [propertyId]);

  return store(selector);
}

/**
 * 🤖 AI GUIDANCE: Single property option access
 * ✅ GOOD: When you need one specific option with reactive updates
 *
 * @param propertyId - Property ID containing the option
 * @param optionId - Specific option ID to retrieve
 * @returns Single property option with reactive updates
 */
export function usePropertyOption(propertyId: string, optionId: string): PropertyOption | undefined {
  const store = useCanvasStore();

  const selector = useCallback(
    (state: CanvasStore) => state.propertyOptions[propertyId]?.[optionId],
    [propertyId, optionId],
  );

  return store(selector);
}

/**
 * 🤖 AI GUIDANCE: Ordered property list access
 * ✅ GOOD: When you need the complete list of properties in display order
 *
 * @returns Array of property IDs sorted by display order
 */
export function useOrderedPropertyIds(): string[] {
  const store = useCanvasStore();
  const ordering = store((state) => state.ordering);

  return useMemo(() => {
    return Object.keys(ordering).sort((a, b) => ordering[a] - ordering[b]);
  }, [ordering]);
}

/**
 * 🤖 AI GUIDANCE: Use for display components that must update (READ-ONLY)
 * ✅ GOOD: Tree names, previews, any text that shows current data
 * ❌ NOT for form inputs or components that need setValue
 *
 * @param options.getValue - Function to extract value from property
 * @param options.locale - Optional locale for localized values
 * @returns String value with reactive updates
 */
export function usePropertyDisplay(options: {
  getValue: (property: FormProperty, locale?: string) => string;
  locale?: string;
}): string {
  const { getValue, locale } = options;
  const { propertyId } = useContext(PropertyRowContext)!;

  const selector = useCallback((property: FormProperty) => getValue(property, locale), [getValue, locale]);
  return useProperty(propertyId, selector) || "";
}
