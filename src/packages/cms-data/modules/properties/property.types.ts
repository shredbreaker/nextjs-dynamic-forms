import { z } from "zod";
import { LocalizedTextSchema } from "@cms-data/modules/localization/localization.types";

// Constants & Enums
export const PROPERTY_TABLE = "cms_properties";
export const PROPERTY_TAG_TABLE = "cms_property_options";
export const PROPERTY_TAGS_VIEW = "cms_domain_property_options";

export const PropertyTypeSchema = z.enum(["option", "bool", "number", "text", "size"]);
export const PropertyUnitTypeSchema = z.enum(["rai", "ngan", "wah", "sqm"]);
export const PropertyOptionSortingSchema = z.enum(["alphabet", "manual"]);

export type PropertyType = z.infer<typeof PropertyTypeSchema>;
export type PropertyUnitType = z.infer<typeof PropertyUnitTypeSchema>;
export type PropertyOptionSorting = z.infer<typeof PropertyOptionSortingSchema>;

// Property Option
export const PropertyOptionBaseSchema = z.object({
  option_id: z.string().uuid(),
  property_id: z.string().uuid(),
  name: LocalizedTextSchema.nullish(),
  display_order: z.number().nullish(),
  code: z.string().nullish(),
});

export type PropertyOptionBase = z.infer<typeof PropertyOptionBaseSchema>;

// Typed Metas
export const PropertyBaseMetaOptionSchema = z.object({
  type: z.literal("option"),
  multi: z.boolean().nullish(),
  sorting: PropertyOptionSortingSchema.nullish(),
});

export const PropertyBaseMetaNumberSchema = z.object({
  type: z.literal("number"),
  integer: z.boolean().nullish(),
  min: z.number().nullish(),
  max: z.number().nullish(),
});

export const PropertyBaseMetaTextSchema = z.object({
  type: z.literal("text"),
  multiline: z.boolean().nullish(),
  max: z.number().nullish(),
});

export const PropertyBaseMetaSchema = z.discriminatedUnion("type", [
  PropertyBaseMetaOptionSchema,
  PropertyBaseMetaNumberSchema,
  PropertyBaseMetaTextSchema,
]);

// Property
export const PropertyBaseSchema = z.object({
  id: z.string().uuid(),
  domain_id: z.string().uuid(),
  group_id: z.string().uuid().nullish(),
  name: LocalizedTextSchema.nullish(),
  description: LocalizedTextSchema.nullish(),
  code: z.string().max(50).nullish(),
  is_locked: z.boolean(),
  type: PropertyTypeSchema,
  meta: PropertyBaseMetaSchema.nullable(),
  display_order: z.number().nullish(),
  is_required: z.boolean(),
  is_private: z.boolean(),
});

export type PropertyBase = z.infer<typeof PropertyBaseSchema>;
export type PropertyBaseMeta = z.infer<typeof PropertyBaseMetaSchema>;
export type PropertyBaseMetaOption = z.infer<typeof PropertyBaseMetaOptionSchema>;
export type PropertyBaseMetaNumber = z.infer<typeof PropertyBaseMetaNumberSchema>;
export type PropertyBaseMetaText = z.infer<typeof PropertyBaseMetaTextSchema>;

/* UPDATE PROPERTY AND TAG INPUT */
export const UpdatePropertyInputSchema = PropertyBaseSchema.omit({
  domain_id: true,
}).extend({ is_new: z.boolean().default(false) });

export const UpdatePropertyOptionInputSchema = PropertyOptionBaseSchema.extend({
  is_new: z.boolean().default(false),
});

export type UpdatePropertyInput = z.infer<typeof UpdatePropertyInputSchema>;
export type UpdatePropertyOptionInput = z.infer<typeof UpdatePropertyOptionInputSchema>;
