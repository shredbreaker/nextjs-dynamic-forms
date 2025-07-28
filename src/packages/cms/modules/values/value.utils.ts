import { ValueBaseData, ValueBaseDataSize, ValueBaseDataSizeSchema } from './value.types';

export function getValueMetaSize(meta: ValueBaseData | null): ValueBaseDataSize | null {
  if (!meta) {
    return null;
  }

  const data = ValueBaseDataSizeSchema.safeParse(meta);
  if (!data.success) {
    return null;
  }
  return data.data;
}
