export function generateInputId(
  entityType: string, // 'property', 'domain', 'group', etc.
  entityId: string, // UUID of the entity
  fieldName: string, // 'name', 'description', 'code', etc.
  variant: string = "", // For variant fields only
  locale?: string, // For localized fields only
): string {
  const suffix = variant.length > 0 ? `_${variant}` : "";
  const baseId = `${entityType}-${fieldName}-input-${entityId}${suffix}`;
  return locale ? `${baseId}-${locale}` : baseId;
}

/**
 * 🏷️ Input ID Patterns - Examples for different entity types
 *
 * All CMS entities follow the same consistent pattern for input IDs.
 * This ensures proper label linking and accessibility across the application.
 */
export const INPUT_ID_EXAMPLES = {
  // Property fields
  propertyName: (id: string, locale: string) => generateInputId("property", "name", id, locale),
  propertyCode: (id: string) => generateInputId("property", "code", id),
  propertyDescription: (id: string, locale: string) => generateInputId("property", "description", id, locale),

  // Domain fields
  domainName: (id: string, locale: string) => generateInputId("domain", "name", id, locale),
  domainCode: (id: string) => generateInputId("domain", "code", id),

  // Group fields
  groupName: (id: string, locale: string) => generateInputId("group", "name", id, locale),

  // Property option fields
  optionName: (id: string, locale: string) => generateInputId("property-option", "name", id, locale),
  optionCode: (id: string) => generateInputId("property-option", "code", id),

  // Value fields (composite IDs)
  valueText: (recordId: string, propertyId: string, locale: string) =>
    generateInputId("value", "text", `${recordId}-${propertyId}`, locale),
} as const;
