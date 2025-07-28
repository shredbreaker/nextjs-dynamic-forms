import { createContext, useContext, useReducer, useState, useMemo } from "react";
import { Property } from "@cms/modules/properties/property.types";
import { Record } from "@cms/modules/records/record.types";
import { Value } from "@cms/modules/values/value.types";
import { EditRecordContextState, EditRecordState } from './edit-record.types';

// Action types for the reducer
type RecordAction =
  | { type: "ADD_VALUE"; value: Value }
  | { type: "DELETE_VALUE"; value: Value }
  | { type: "ADD_PROPERTY"; property: Property }
  | { type: "DELETE_PROPERTY"; property: Property }
  | { type: "RESET_FORM"; values: Value[]; properties: Property[] };

// Reducer function that handles all state updates
function formRecordReducer(state: EditRecordState, action: RecordAction): EditRecordState {
  switch (action.type) {
    case "ADD_VALUE": {
      const value = {
        ...action.value,
        id: action.value.id,
      };
      return {
        ...state,
        values: [...state.values, value],
      };
    }

    case "DELETE_VALUE": {
      const valueId = action.value.id;
      const newDeletedValues = [...state.deletedValues];

      // If it's an existing value (has real ID), track it for deletion
      if (action.value.id && valueId && !state.deletedValues.includes(valueId)) {
        newDeletedValues.push(valueId);
      }

      return {
        ...state,
        values: state.values.filter((v) => v.id !== valueId),
        deletedValues: newDeletedValues,
      };
    }

    case "ADD_PROPERTY": {
      const property = {
        ...action.property,
        id: action.property.id,
      };
      return {
        ...state,
        properties: [...state.properties, property],
      };
    }

    case "DELETE_PROPERTY": {
      const propertyId = action.property.id;
      const newDeletedProperties = [...state.deletedProperties];

      if (action.property.id && propertyId && !state.deletedProperties.includes(propertyId)) {
        newDeletedProperties.push(propertyId);
      }

      return {
        ...state,
        properties: state.properties.filter((p) => p.id !== propertyId),
        deletedProperties: newDeletedProperties,
      };
    }

    case "RESET_FORM": {
      return {
        record: state.record,
        values: action.values.filter((value) => value.id),
        deletedValues: [],
        properties: action.properties.filter((property) => property.id),
        deletedProperties: [],
      };
    }

    default:
      return state;
  }
}

export function EditRecordFormProvider({
  children,
  domainId,
  recordId,
  initialRecord = null,
  initialValues = [],
  initialProperties = [],
  initialCurrentLanguageCode,
}: {
  children: React.ReactNode;
  domainId: string;
  recordId: string | null;
  initialRecord?: Record | null;
  initialValues?: Value[];
  initialProperties?: Property[];
  initialCurrentLanguageCode?: string;
}) {
  // UI state
  const [isDevMode, setIsDevMode] = useState(true);
  const [, setCurrentLanguageCode] = useState(initialCurrentLanguageCode);

  // Form state with reducer
  const [formState, dispatch] = useReducer(formRecordReducer, {
    record: initialRecord,
    values: initialValues.map((value) => ({ ...value, tempId: value.id })),
    deletedValues: [],
    properties: initialProperties.map((property) => ({ ...property, tempId: property.id })),
    deletedProperties: [],
  });

  // Actions object (memoized to prevent unnecessary re-renders)
  const actions = useMemo(
    () => ({
      addValue: (value: Value) => dispatch({ type: "ADD_VALUE", value }),
      deleteValue: (value: Value) => dispatch({ type: "DELETE_VALUE", value }),
      addProperty: (property: Property) => dispatch({ type: "ADD_PROPERTY", property }),
      deleteProperty: (property: Property) => dispatch({ type: "DELETE_PROPERTY", property }),
      resetForm: (values: Value[], properties: Property[]) => dispatch({ type: "RESET_FORM", values, properties }),
      getProperty: (id: string | null) => (id ? formState.properties.find((p) => p.id === id) || null : null),
      getValue: (propertyId: string | null) => {
        if (!propertyId) {
          return null;
        }
        const values = formState.values.filter((v) => v.property_id === propertyId);
        return values.length > 0 ? values[0] : null;
      },

      // UI actions
      setDevMode: setIsDevMode,
      setCurrentLanguageCode: setCurrentLanguageCode,
    }),
    [formState.properties, formState.values],
  );

  const contextValue: EditRecordContextState = {
    isDevMode,
    currentLanguageCode: "en",
    languageCodes: [],
    domainId,
    recordId: recordId,
    formState,
    actions,
  };

  return <EditRecordContext.Provider value={contextValue}>{children}</EditRecordContext.Provider>;
}

export const EditRecordContext = createContext<EditRecordContextState | null>(null);

export function useEditRecordContext(): EditRecordContextState {
  const context = useContext(EditRecordContext);
  if (!context) {
    throw new Error("useEditRecordContext must be used within a EditRecordContextProvider");
  }
  return context;
}
