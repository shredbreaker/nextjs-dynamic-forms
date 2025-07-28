import { z } from "zod";

// Utility to get select fields from schema
export function zodFieldsToString<T extends z.ZodObject<z.ZodRawShape>>(schema: T): string {
  return Object.keys(schema.shape).join(", ");
}

export function zodEmptyObjectToNull(val: unknown): unknown | null {
  if (!val || (typeof val === "object" && Object.keys(val).length === 0)) {
    return null;
  }
  return val;
}

/**
 * Flattens a schema by adding a prefix to each field
 * @param schema - The schema to flatten
 * @param prefix - The prefix to add to each field
 * @returns A new schema with prefixed fields
 */
export const zodSchemaFlat = <T extends z.ZodObject<z.ZodRawShape>>(
  schema: T,
  prefix: string,
): z.ZodObject<z.ZodRawShape> => {
  const shape = Object.entries(schema.shape).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [`${prefix}_${key}`]: value,
    }),
    {},
  );

  return z.object(shape);
};

// source: { en: "John", th: "จอห์น", ru: "Джон" }
// result: { name_en: "John", name_th: "จอห์น", name_ru: "Джон" }
export const addPrefixToFields = <T extends object>(object: T, prefix: string): T => {
  return Object.fromEntries(Object.entries(object).map(([key, value]) => [`${prefix}_${key}`, value])) as T;
};

// source: { name_en: "John", name_th: "จอห์น", name_ru: "Джон" }
// result: { en: "John", th: "จอห์น", ru: "Джон" }
export const extractFieldsByPrefix = <T extends object>(object: T, prefix: string): T => {
  const prefixPattern = new RegExp(`^${prefix}_`);
  const prefixedValues = Object.entries(object).filter(([key]) => key.startsWith(prefix + "_"));
  const mappedValues = prefixedValues.map(([key, value]) => [key.replace(prefixPattern, ""), value]);
  return Object.fromEntries(mappedValues) as T;
};

export function formDataToObject(formData: FormData): object {
  return Object.fromEntries(formData.entries());
}
