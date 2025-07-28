"use client";

import { useCallback } from "react";
import { usePropertyId, usePropertyStore, useProperty } from "@cms/modules/properties/form/hooks";
import type { FormProperty } from "@cms/modules/properties/form/types";

export const usePropertyBoolToggle = (
  propertyKey: keyof Pick<FormProperty, "is_locked" | "is_private" | "is_required">,
): {
  isActive: boolean;
  handleToggle: () => void;
} => {
  const propertyId = usePropertyId();
  const store = usePropertyStore();
  const { updateProperty } = store.getState();
  const isActive = useProperty((p) => p[propertyKey]) ?? false;

  const handleToggle = useCallback(() => {
    updateProperty(propertyId, (draft: FormProperty) => {
      draft[propertyKey] = !draft[propertyKey];
    });
  }, [propertyId, propertyKey, updateProperty]);

  return {
    isActive,
    handleToggle,
  };
};
