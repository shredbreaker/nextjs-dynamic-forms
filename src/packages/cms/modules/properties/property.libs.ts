"use server";

import { batchUpdateProperties as coreBatchUpdateProperties } from "@cms-data/modules/properties/property.libs";
import { Property, PropertyOption } from "./property.types";

export async function batchUpdateProperties(
  userId: string,
  domainId: string,
  allProperties: Property[],
  allOptions: PropertyOption[],
  deletedPropertyIds: string[],
  deletedOptionIds: string[],
): Promise<void> {
  return coreBatchUpdateProperties(userId, domainId, allProperties, allOptions, deletedPropertyIds, deletedOptionIds);
}
