"use client";

import { useContext } from "react";
import { PropertyIdContext } from "@cms/modules/properties/form/contexts/property-id.context";

export const usePropertyId = (): string => {
  const context = useContext(PropertyIdContext);
  if (!context) {
    throw new Error("usePropertyId must be used within a PropertyIdProvider");
  }
  return context;
};
