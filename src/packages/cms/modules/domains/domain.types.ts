export * from "@cms-data/modules/domains/domain.types";
import z from "zod";
import { DomainBaseMetaSchema, DomainBaseSchema } from "@cms-data/modules/domains/domain.types";
import { zodEmptyObjectToNull } from "@cms-data/utils";

// Form/display safe version of the base schema
export const DomainSchema = DomainBaseSchema.omit({
  creator_id: true,
}).extend({
  display_order: DomainBaseSchema.shape.display_order.or(z.string().transform(Number)).default(0).nullish(),
  is_active: DomainBaseSchema.shape.is_active.or(z.string().transform((s) => s === "true")).default(false),
  is_locked: DomainBaseSchema.shape.is_locked.or(z.string().transform((s) => s === "true")).default(false),
  meta: z.preprocess(zodEmptyObjectToNull, DomainBaseMetaSchema).nullish(),
});

// Schema for creating new domains (without id)
export const NewDomainSchema = DomainSchema.omit({
  id: true,
});

// Types
export type Domain = z.infer<typeof DomainSchema>;
export type NewDomain = z.infer<typeof NewDomainSchema>;
