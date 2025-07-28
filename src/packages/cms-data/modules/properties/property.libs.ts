import { UpdatePropertyInput, UpdatePropertyOptionInput } from "./property.types";

export async function batchUpdateProperties(
  userId: string,
  domainId: string,
  allProperties: UpdatePropertyInput[],
  allOptions: UpdatePropertyOptionInput[],
  deletedPropertyIds: string[],
  deletedOptionIds: string[],
): Promise<void> {
  console.log("batchUpdateProperties DB>>>");
  console.log("userId", userId);
  console.log("domainId", domainId);
  console.log("allProperties", allProperties);
  console.log("allOptions", allOptions);
  console.log("deletedPropertyIds", deletedPropertyIds);
  console.log("deletedOptionIds", deletedOptionIds);
}
