"use client";

import { createContext, memo } from "react";

export const PropertyIdContext = createContext<string | null>(null);

export const PropertyIdProvider = memo(
  ({ propertyId, children }: { propertyId: string; children: React.ReactNode }) => {
    return <PropertyIdContext.Provider value={propertyId}>{children}</PropertyIdContext.Provider>;
  },
);

PropertyIdProvider.displayName = "PropertyIdProvider";
