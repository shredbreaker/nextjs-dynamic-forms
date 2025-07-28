/**
 * Record Editor Integration Example
 *
 * This example demonstrates how to use the reactive value system
 * in a record editor context.
 */
import React, { useState } from "react";
import { Property } from "@cms/modules/properties/property.types";
import { PropertyValueRenderer } from "@cms/modules/values/components/PropertyValueRenderer";
import { PropertyValueProvider } from "@cms/modules/values/contexts/property-value.context";
import { ValueInputMode } from "@cms/modules/values/types/value-input.types";
import { Value } from "@cms/modules/values/value.types";

interface RecordEditorProps {
  properties: Property[];
  initialValues: Record<string, Value>;
  onSave: (values: Record<string, Value>) => void;
}

/**
 * Example Record Editor using reactive value components
 */
export function RecordEditor({ properties, initialValues, onSave }: RecordEditorProps) {
  const [values, setValues] = useState<Record<string, Value>>(initialValues);

  // Handle value changes for a specific property
  const handleValueChange = (propertyId: string, value: Value) => {
    setValues((prev) => ({
      ...prev,
      [propertyId]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {properties.map((property) => {
        const currentValue = values[property.id];

        return (
          <div key={property.id} className="rounded-md border p-4">
            <PropertyValueProvider
              property={property}
              value={currentValue}
              mode={ValueInputMode.ENTRY}
              onChange={(value) => handleValueChange(property.id, value)}
            >
              <PropertyValueRenderer />
            </PropertyValueProvider>
          </div>
        );
      })}

      <div className="flex justify-end">
        <button type="submit" className="rounded-md bg-blue-500 px-4 py-2 text-white">
          Save Record
        </button>
      </div>
    </form>
  );
}

/**
 * Example usage of the RecordEditor
 */
export function RecordEditorExample() {
  // Sample properties
  const sampleProperties: Property[] = [
    {
      id: "prop-1",
      name: { en: "Title" },
      code: "title",
      type: "text",
      is_locked: false,
      is_required: true,
      is_private: false,
      meta: {
        type: "text",
        multiline: false,
        max: 100,
      },
      is_new: false,
      display_order: 1,
    },
    {
      id: "prop-2",
      name: { en: "Description" },
      code: "description",
      type: "text",
      is_locked: false,
      is_required: false,
      is_private: false,
      meta: {
        type: "text",
        multiline: true,
        max: 500,
      },
      is_new: false,
      display_order: 2,
    },
    {
      id: "prop-3",
      name: { en: "Price" },
      code: "price",
      type: "number",
      is_locked: false,
      is_required: true,
      is_private: false,
      meta: {
        type: "number",
        integer: false,
        min: 0,
      },
      is_new: false,
      display_order: 3,
    },
  ];

  // Sample initial values
  const initialValues: Record<string, Value> = {
    "prop-1": {
      id: "value-1",
      property_id: "prop-1",
      record_id: "record-1",
      is_new: false,
      value_text: { en: "Sample Title" },
      value_data: null,
    },
    "prop-2": {
      id: "value-2",
      property_id: "prop-2",
      record_id: "record-1",
      is_new: false,
      value_text: { en: "This is a sample description for the record." },
      value_data: null,
    },
    "prop-3": {
      id: "value-3",
      property_id: "prop-3",
      record_id: "record-1",
      is_new: false,
      value_number: 99.99,
      value_data: null,
    },
  };

  // Handle save action
  const handleSave = (values: Record<string, Value>) => {
    console.log("Saving record with values:", values);
    // In a real app, you would call an API here
  };

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Edit Record</h1>
      <RecordEditor properties={sampleProperties} initialValues={initialValues} onSave={handleSave} />
    </div>
  );
}
