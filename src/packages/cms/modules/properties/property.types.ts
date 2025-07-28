export * from "@cms-data/modules/properties/property.types";

import { z } from "zod";
import {
  PropertyBaseMetaNumberSchema,
  PropertyBaseMetaOptionSchema,
  PropertyBaseMetaTextSchema,
  PropertyBaseSchema,
  PropertyOptionBaseSchema,
} from "@cms-data/modules/properties/property.types";
import { zodEmptyObjectToNull } from "@cms-data/utils";

// Form-friendly Meta Schemas
export const PropertyMetaNumberSchema = PropertyBaseMetaNumberSchema.extend({
  integer: PropertyBaseMetaNumberSchema.shape.integer
    .or(z.string().transform((s) => s === "true"))
    .default(false)
    .nullish(),
  min: PropertyBaseMetaNumberSchema.shape.min.or(z.string().transform(Number)).nullish(),
  max: PropertyBaseMetaNumberSchema.shape.max.or(z.string().transform(Number)).nullish(),
});

export const PropertyMetaTextSchema = PropertyBaseMetaTextSchema.extend({
  multiline: PropertyBaseMetaTextSchema.shape.multiline
    .or(z.string().transform((s) => s === "true"))
    .default(false)
    .nullish(),
  max: PropertyBaseMetaTextSchema.shape.max.or(z.string().transform(Number)).default(0).nullish(),
});

export const PropertyMetaOptionSchema = PropertyBaseMetaOptionSchema.extend({
  multi: PropertyBaseMetaOptionSchema.shape.multi
    .or(z.string().transform((s) => s === "true"))
    .default(false)
    .nullish(),
});

export const PropertyMetaSchema = z.discriminatedUnion("type", [
  PropertyMetaOptionSchema,
  PropertyMetaNumberSchema,
  PropertyMetaTextSchema,
]);

export const PropertyOptionSchema = PropertyOptionBaseSchema.extend({
  display_order: PropertyOptionBaseSchema.shape.display_order.or(z.string().transform(Number)).default(0).nullish(),
  is_new: z
    .boolean()
    .or(z.string().transform((s) => s === "true"))
    .default(false),
});

export const PropertySchema = PropertyBaseSchema.omit({
  domain_id: true,
}).extend({
  meta: z.preprocess(zodEmptyObjectToNull, PropertyMetaSchema.nullable()),
  display_order: PropertyOptionBaseSchema.shape.display_order.or(z.string().transform(Number)).default(0).nullish(),
  is_required: PropertyBaseSchema.shape.is_required.or(z.string().transform((s) => s === "true")),
  is_private: PropertyBaseSchema.shape.is_private.or(z.string().transform((s) => s === "true")),
  is_locked: PropertyBaseSchema.shape.is_locked.or(z.string().transform((s) => s === "true")),
  options: z.array(PropertyOptionSchema).nullish(),
  is_new: z
    .boolean()
    .or(z.string().transform((s) => s === "true"))
    .default(false),
});

// Types
export type PropertyMetaNumber = z.infer<typeof PropertyMetaNumberSchema>;
export type PropertyMetaText = z.infer<typeof PropertyMetaTextSchema>;
export type PropertyMetaOption = z.infer<typeof PropertyMetaOptionSchema>;
export type PropertyMeta = z.infer<typeof PropertyMetaSchema>;

export type PropertyOption = z.infer<typeof PropertyOptionSchema>;
export type Property = z.infer<typeof PropertySchema>;

/**
 * Returns the default PropertyMeta for a given type, or null if not required.
 */
