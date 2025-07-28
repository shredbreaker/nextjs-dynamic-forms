import { Domain } from "@cms/modules/domains/domain.types";

export type EditDomainFormState = {
  formData?: Domain | null;
  error?: string | null;
};

export type EditDomainFormData = Domain & {
  system_description?: string;
};
