import { useCallback } from "react";
import { PropertyOptionSorting } from "@cms-data/modules/properties/property.types";
import { useProperty } from "@cms/modules/properties/form";
import { usePropertyId, usePropertyStore } from "@cms/modules/properties/form/hooks";

export const usePropertyMetaOptionMultiToggle = (): {
  isActive: boolean;
  handleToggle: () => void;
} => {
  const propertyId = usePropertyId();
  const store = usePropertyStore();
  const { updateProperty } = store.getState();
  const isActive = useProperty((p) => p.meta?.type === "option" && p.meta.multi);

  const handleToggle = useCallback(() => {
    updateProperty(propertyId, (draft) => {
      if (draft.meta?.type !== "option") return;
      draft.meta.multi = !draft.meta.multi;
    });
  }, [propertyId, updateProperty]);

  return {
    isActive: isActive ?? false,
    handleToggle,
  };
};

export const usePropertyMetaOptionSorting = (): {
  value: PropertyOptionSorting;
  setValue: (value: PropertyOptionSorting) => void;
} => {
  const propertyId = usePropertyId();
  const store = usePropertyStore();
  const value = useProperty((p) => {
    if (p.meta?.type !== "option") return "manual";
    return p.meta.sorting;
  });

  const setValue = useCallback(
    (value: PropertyOptionSorting) => {
      store.getState().updateProperty(propertyId, (draft) => {
        if (draft.meta?.type !== "option") return;
        draft.meta.sorting = value;
      });
    },
    [propertyId, store],
  );

  return {
    value: value ?? "alphabet",
    setValue,
  };
};
