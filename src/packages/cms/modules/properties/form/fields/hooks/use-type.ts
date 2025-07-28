import { useCallback } from "react";
import { FormProperty } from "@cms/modules/properties/form";
import { usePropertyStore } from "@cms/modules/properties/form/fields/property-options/hooks";
import { usePropertyId, useProperty } from "@cms/modules/properties/form/hooks";
import { PropertyMeta, PropertyType } from "@cms/modules/properties/property.types";

export function getDefaultMeta(type: PropertyType): PropertyMeta | null {
  if (type === "option") return { type: "option", multi: false, sorting: "alphabet" } as PropertyMeta;
  if (type === "number") return { type: "number", integer: true, min: 0, max: null } as PropertyMeta;
  if (type === "text") return { type: "text", multiline: true, max: 4096 } as PropertyMeta;
  return null;
}

export function usePropertyType(): {
  propertyType: PropertyType;
  handleChange: (type: PropertyType) => void;
} {
  const store = usePropertyStore();
  const { updateProperty } = store.getState();
  const propertyId = usePropertyId();
  const propertyType = useProperty((property) => property.type);

  if (!propertyType) throw new Error("PropertyTypeSelector must be used within a valid property context");

  const handleChange = useCallback(
    (type: PropertyType) => {
      updateProperty(propertyId, (draft: FormProperty) => {
        draft.type = type;
        draft.meta = getDefaultMeta(type);
      });
    },
    [propertyId, updateProperty],
  );

  return {
    propertyType,
    handleChange,
  };
}
