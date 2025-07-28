export * from "@cms-data/modules/values/value.types";
import { z } from "zod";
import { ValueBaseDataSchema, ValueBaseSchema } from "@cms-data/modules/values/value.types";
import { zodEmptyObjectToNull } from "@cms-data/utils";
import { PropertySchema, PropertyOptionSchema } from "@cms/modules/properties/property.types";

export const ValueSchema = ValueBaseSchema.omit({
  creator_id: true,
}).extend({
  value_number: ValueBaseSchema.shape.value_number.or(z.string().transform(Number)).nullish(),
  value_data: z.preprocess(zodEmptyObjectToNull, ValueBaseDataSchema.nullable()),
  options: z.array(PropertyOptionSchema).nullish(),
  property: PropertySchema.nullish(),
  is_new: z
    .boolean()
    .or(z.string().transform((s) => s === "true"))
    .default(false),
});

export type Value = z.infer<typeof ValueSchema>;
