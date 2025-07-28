"use client";
import { useContext } from "react";
import { useStore } from "zustand";
import { PropertyStoreContext } from "@cms/modules/properties/form/contexts/property-store.context";
import { PropertyStore } from "@cms/modules/properties/form/stores/property.store";
import type { FormProperty } from "@cms/modules/properties/form/types";
import { usePropertyId } from ".";

export const useProperties = <T>(selector: (store: PropertyStore) => T): T => {
  const storeContext = useContext(PropertyStoreContext);

  if (storeContext === null) {
    throw new Error("useProperties must be used within PropertyStoreProvider");
  }

  return useStore(storeContext, selector);
};

export const useProperty = <T>(selector: (property: FormProperty) => T): T | undefined => {
  const propertyId = usePropertyId();
  return useProperties((s) => {
    const property = s.properties[propertyId];
    return property ? selector(property) : undefined;
  });
};
