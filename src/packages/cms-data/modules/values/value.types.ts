import { z } from "zod";
import { LocalizedTextSchema } from "@cms-data/modules/localization/localization.types";
import { PropertyUnitTypeSchema } from "@cms-data/modules/properties/property.types";

// Database Types
export const ValueTable = "cms_values";

export const ValueBaseDataSizeSchema = z.object({
  type: z.literal("size"),
  unit_type: PropertyUnitTypeSchema,
});

export const ValueBaseDataSchema = z.discriminatedUnion("type", [ValueBaseDataSizeSchema]);

export const ValueBaseSchema = z.object({
  id: z.string().uuid(),
  property_id: z.string().uuid(),
  record_id: z.string().uuid(),
  value_text: LocalizedTextSchema.nullish(),
  value_bool: z.boolean().nullish(),
  value_number: z.number().nullish(),
  value_data: ValueBaseDataSchema.nullable(),
  value_uuids: z.array(z.string().uuid()).nullish(),
  creator_id: z.string().uuid(),
});

// Types
export type ValueBase = z.infer<typeof ValueBaseSchema>;
export type ValueBaseDataSize = z.infer<typeof ValueBaseDataSizeSchema>;
export type ValueBaseData = z.infer<typeof ValueBaseDataSchema>;
