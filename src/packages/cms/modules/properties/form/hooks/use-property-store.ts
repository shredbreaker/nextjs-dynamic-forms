"use client";

import { useContext } from "react";
import { PropertyStoreContext, PropertyStoreApi } from "@cms/modules/properties/form/contexts/property-store.context";

// ✅ Store API Hook (for mutations)
export const usePropertyStore = (): PropertyStoreApi => {
  const storeContext = useContext(PropertyStoreContext);

  if (storeContext === null) {
    throw new Error("usePropertyStore must be used within PropertyStoreProvider");
  }

  return storeContext;
};

export const usePropertyStoreActions = (): PropertyStoreApi => {
  const storeContext = useContext(PropertyStoreContext);

  if (storeContext === null) {
    throw new Error("usePropertyStore must be used within PropertyStoreProvider");
  }

  return storeContext;
};
