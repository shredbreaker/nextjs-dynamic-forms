import { UpdateDomainInput, DomainBase } from "./domain.types";

export async function updateDomain(id: string, domain: UpdateDomainInput): Promise<DomainBase | null> {
  console.log("updateDomain db >>>");
  console.log("id", id);
  console.log("domain", domain);
  return null;
}
