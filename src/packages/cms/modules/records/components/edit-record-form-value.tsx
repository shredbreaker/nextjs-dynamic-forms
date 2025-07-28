import LocalizedTextField from "@cms/modules/localization/components/localized-text-field";
import { Property } from "@cms/modules/properties/property.types";
import { ValueSchema } from "@cms/modules/values/value.types";
import { getValueMetaSize } from "@cms/modules/values/value.utils";
import { useEditRecordContext } from "./edit-record.context";

export function EditRecordValue({ property }: { property: Property }) {
  const { actions } = useEditRecordContext();
  const value =
    actions.getValue(property.id) ||
    ValueSchema.parse({
      property_id: property.id,
    });

  if (!property) {
    return <div />;
  }

  return (
    <div className="flex min-w-xs flex-col rounded-md bg-slate-300 p-4 font-sans text-sm">
      <div className="flex flex-col space-y-2">
        <h2>Property</h2>
        <LocalizedTextField
          localizedText={property?.name || {}}
          prefix="name"
          placeholder="Enter a localized name"
          isReadOnly={true}
        />
        <span>Code: {property?.code}</span>
        <span>Type: {property?.type}</span>
      </div>

      <div>
        {value && (
          <div className="flex flex-row space-x-2 bg-slate-300">
            {property.type === "text" && <span>Text Value: {value.value_text?.en}</span>}
            {property.type === "bool" && <span>Boolean Value: {value.value_bool}</span>}
            {property.type === "number" && <span>Number Value: {value.value_number}</span>}
            {property.type === "size" && <span>Size Value: {JSON.stringify(getValueMetaSize(value.value_data))}</span>}
            {property.type === "option" && <span>Option Value: {value.value_uuids}</span>}
          </div>
        )}
        <span className="mx-auto flex w-full flex-col rounded bg-slate-300 whitespace-pre-wrap">
          Data Value: {JSON.stringify(value.value_data, null, 2)}
        </span>{" "}
      </div>
    </div>
  );
}
