"use server";

import { ZodError } from "zod";
import { updateDomain } from "@cms-data/modules/domains/domain.libs";
import { UpdateDomainInput } from "@cms-data/modules/domains/domain.types";
import { EditDomainFormState } from "@cms/modules/domains/components/edit-domain.types";
import { convertFormDataToDomain } from "@cms/modules/domains/domain.utils";

export async function updateDomainAction(
  previousState: EditDomainFormState,
  formData: FormData,
): Promise<EditDomainFormState> {
  let error: string | null = null;
  let domain: UpdateDomainInput | null = null;

  try {
    const payload = await convertFormDataToDomain(formData);

    domain = await updateDomain(payload.id, payload);
    if (!domain) {
      throw new Error("Failed to update domain");
    }
  } catch (err) {
    if (err instanceof ZodError) {
      error = err.message;
    } else if (err instanceof Error) {
      error = err.message;
    } else {
      error = "Invalid data";
    }
  }

  return {
    formData: domain,
    error: error,
  };
}
