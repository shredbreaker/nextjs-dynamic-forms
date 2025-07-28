"use server";

import { Domain } from "@cms/modules/domains/domain.types";
import { Property, PropertyOption } from "@cms/modules/properties/property.types";

export type SavePropertiesResponse = {
  success: boolean;
  error: string | null;
};

export async function saveProperties(
  domainId: string,
  properties: Property[],
  options: PropertyOption[],
  deletedPropertyIds: string[],
  deletedOptionIds: string[],
): Promise<void> {
  console.log("saveProperties >>>");
  console.log("domainId", domainId);
  console.log("properties", properties);
  console.log("options", options);
  console.log("deletedPropertyIds", deletedPropertyIds);
  console.log("deletedOptionIds", deletedOptionIds);
}

export async function saveDomain(domain: Domain): Promise<void> {
  console.log("saveDomain >>>");
  console.log("domain", domain);
}
