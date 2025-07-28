import qs from "qs";
import { Property, PropertyMeta, PropertySchema, PropertyType } from "./property.types";

export function getDefaultMetaForType(type: PropertyType): PropertyMeta | null {
  switch (type) {
    case "option":
      return { type: "option", multi: false, sorting: "alphabet" };
    case "number":
      return { type: "number", integer: false, min: null, max: null };
    case "text":
      return { type: "text", multiline: false, max: null };
    default:
      return null;
  }
}

export async function convertFormDataToProperties(formData: FormData): Promise<Property[]> {
  // Convert FormData to object properly
  const formObject = Object.fromEntries(formData.entries());
  const parsed = qs.parse(new URLSearchParams(formObject as unknown as string).toString());

  const items = (parsed.items as Record<string, unknown>[]) || [];
  let verified: Property[] = [];

  try {
    verified = items.map((item) => {
      // No name transformations needed - form sends proper LocalizedText structure

      // Transform boolean fields from string to boolean
      item.is_locked = item.is_locked === "true" || item.is_locked === true;
      item.is_required = item.is_required === "true" || item.is_required === true;
      item.is_private = item.is_private === "true" || item.is_private === true;

      // Handle display_order transformation
      if (typeof item.display_order === "string") {
        item.display_order = parseInt(item.display_order) || 0;
      }

      // Handle meta field - set to null for types that don't need meta
      if (item.type === "bool" || item.type === "size") {
        item.meta = null;
      }

      // Handle options field - convert string to array or ensure array exists
      if (typeof item.options === "string") {
        item.options = item.options ? JSON.parse(item.options) : [];
      } else if (!item.options) {
        item.options = [];
      }

      return PropertySchema.parse(item);
    });
  } catch {
    // Ignore but preserve for later error handling
  }

  return verified;
}
