import { z } from "zod";

export const RecordTable = "cms_records";

export const RecordBaseValuesPreviewSchema = z.object({
  code: z.string(),
});

export const RecordBaseMetaSchema = z.object({
  notes: z.string().nullish(),
});

export const RecordBaseSchema = z.object({
  id: z.string().uuid(),
  domain_id: z.string(),
  values_preview: RecordBaseValuesPreviewSchema.nullish(),
  meta: RecordBaseMetaSchema.nullish(),
  creator_id: z.string().uuid().nullish(),
});

// Types
export type RecordBase = z.infer<typeof RecordBaseSchema>;
export type RecordBaseMeta = z.infer<typeof RecordBaseMetaSchema>;
export type RecordBaseValuesPreview = z.infer<typeof RecordBaseValuesPreviewSchema>;
