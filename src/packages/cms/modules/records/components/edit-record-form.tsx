"use client";
import { useLocale } from "next-intl";
import { Property } from "@cms/modules/properties/property.types";
import { Record } from "@cms/modules/records/record.types";
import { Value } from "@cms/modules/values/value.types";
import { EditRecordValue } from "./edit-record-form-value";
import { EditRecordFormProvider, useEditRecordContext } from "./edit-record.context";

export default function EditRecordForm({
  domainId,
  recordId,
  record,
  properties,
  values,
}: {
  domainId: string;
  recordId: string | null;
  record: Record | null;
  properties: Property[];
  values: Value[];
}) {
  const currentLocale = useLocale();

  return (
    <EditRecordFormProvider
      domainId={domainId}
      recordId={recordId}
      initialRecord={record}
      initialValues={values}
      initialProperties={properties}
      initialCurrentLanguageCode={currentLocale}
    >
      <EditRecordFormContent />
    </EditRecordFormProvider>
  );
}

function EditRecordFormContent() {
  const { domainId, recordId, formState } = useEditRecordContext();

  const { properties } = formState;

  return (
    <div>
      <h1>Edit Record</h1>
      <span>Domain ID: {domainId}</span>
      <span>{recordId}</span>

      <div className="flex flex-row flex-wrap">
        {properties.map((property) => (
          <div key={property.id} className="m-4 overflow-clip">
            <EditRecordValue property={property} />
          </div>
        ))}
      </div>
    </div>
  );
}
