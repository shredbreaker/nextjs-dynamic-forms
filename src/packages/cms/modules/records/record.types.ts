export * from "@cms-data/modules/records/record.types";
import { z } from "zod";
import { RecordBaseSchema } from "@cms-data/modules/records/record.types";
import { ValueSchema } from "@cms/modules/values/value.types";

export const RecordSchema = RecordBaseSchema.omit({
  domain_id: true,
  values_preview: true,
  creator_id: true,
}).extend({
  values: z.array(ValueSchema).nullish(),
});

export type Record = z.infer<typeof RecordSchema>;
