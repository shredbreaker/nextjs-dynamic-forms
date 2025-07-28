import { PropertyBaseMeta, PropertyType } from "./property.types";

export function createPropertyMeta(type: PropertyType): PropertyBaseMeta | null {
  switch (type) {
    case "text":
    case "number":
    case "option":
      return { type };
    default:
      return null;
  }
}
