import { Property } from "@cms/modules/properties/property.types";
import { Record } from "@cms/modules/records/record.types";
import { Value } from "@cms/modules/values/value.types";

export type EditRecordState = {
  record: Record | null;
  values: Value[];
  deletedValues: string[];
  properties: Property[];
  deletedProperties: string[];
};

// Context state type
export type EditRecordContextState = {
  isDevMode: boolean;
  currentLanguageCode: string;
  languageCodes: string[];
  domainId: string;
  recordId: string | null;
  formState: EditRecordState;
  actions: {
    // Form state actions
    getProperty: (id: string | null) => Property | null;
    getValue: (propertyId: string | null) => Value | null;
    addValue: (value: Value) => void;
    deleteValue: (value: Value) => void;
    addProperty: (property: Property) => void;
    deleteProperty: (property: Property) => void;
    // UI actions
    setDevMode: (isDevMode: boolean) => void;
    setCurrentLanguageCode: (code: string) => void;
  };
};
