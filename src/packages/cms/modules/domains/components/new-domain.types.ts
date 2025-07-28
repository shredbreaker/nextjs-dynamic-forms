import { Domain } from "@cms/modules/domains/domain.types";

export type NewDomainState = {
  domain: Domain | null;
  error: string | null;
};
