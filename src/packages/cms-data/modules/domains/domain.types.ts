import { z } from "zod";
import { LocalizedTextSchema } from "@cms-data/modules/localization/localization.types";

/* DB Table Constant */
export const DOMAIN_TABLE = "cms_domains";

/* BASE Domain Schema */
export const DomainBaseMetaSchema = z.object({
  system_description: z.string().nullish(),
});

export const DomainBaseSchema = z.object({
  id: z.string().uuid(),
  name: LocalizedTextSchema.nullish(),
  description: LocalizedTextSchema.nullish(),
  code: z.string().nullish(),
  display_order: z.number().nullish(),
  is_active: z.boolean(),
  is_locked: z.boolean(),
  creator_id: z.string().uuid().nullish(),
  meta: DomainBaseMetaSchema.nullish(),
});

export type DomainBase = z.infer<typeof DomainBaseSchema>;
export type DomainBaseMeta = z.infer<typeof DomainBaseMetaSchema>;

/* LISTING Domain Schema */
export const DomainBaseListingSchema = DomainBaseSchema.pick({
  id: true,
  name: true,
  code: true,
  display_order: true,
  is_active: true,
  creator_id: true,
});

export type DomainBaseListing = z.infer<typeof DomainBaseListingSchema>;

/* UPDATE Domain Input */
export const UpdateDomainInputSchema = DomainBaseSchema.omit({
  creator_id: true,
});

export type UpdateDomainInput = z.infer<typeof UpdateDomainInputSchema>;

/* CREATE Domain Input */
export const CreateDomainInputSchema = DomainBaseSchema.omit({
  creator_id: true,
  id: true,
});

export type CreateDomainInput = z.infer<typeof CreateDomainInputSchema>;
