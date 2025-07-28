import { localizedTextFromBrackets } from "@cms/modules/localization/localization.utils";
import { Domain, DomainSchema, NewDomain, NewDomainSchema } from './domain.types';

/**
 * Convert FormData to Domain object (for existing domains with id)
 */
export async function convertFormDataToDomain(formData: FormData): Promise<Domain> {
  return convertFormDataToDomainInternal(formData, DomainSchema) as Promise<Domain>;
}

/**
 * Convert FormData to NewDomain (for creation, without id)
 */
export async function convertFormDataToNewDomain(formData: FormData): Promise<NewDomain> {
  return convertFormDataToDomainInternal(formData, NewDomainSchema) as Promise<NewDomain>;
}

async function convertFormDataToDomainInternal(
  formData: FormData,
  schema: typeof DomainSchema | typeof NewDomainSchema,
): Promise<Domain | NewDomain> {
  const formObject = Object.fromEntries(formData.entries());

  const domainData: Record<string, unknown> = {
    ...(schema === DomainSchema && { id: formObject.id }),
    name: localizedTextFromBrackets(formObject, "name"),
    code: formObject.code || null,
    is_active: formObject.is_active === "true",
    is_locked: formObject.is_locked === "true",
    display_order: formObject.display_order ? Number(formObject.display_order) : null,
  };

  // Build meta
  const systemDescription = formObject.system_description || formObject["meta[system_description]"];
  domainData.meta = systemDescription ? { system_description: systemDescription.toString() } : null;

  return schema.parse(domainData);
}
