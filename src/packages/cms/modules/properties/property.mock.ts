import { Property } from "./property.types";

export const mockProperties: Property[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    group_id: "550e8400-e29b-41d4-a716-446655440000",
    name: {
      en: "Property 1",
      th: "สินค้า 1",
      ru: "Свойство 1",
    },
    code: "property_1",
    is_locked: false,
    type: "text",
    meta: {
      type: "text",
      multiline: false,
      max: 100,
    },
    is_required: false,
    is_private: false,
    is_new: false,
    options: [],
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    group_id: "550e8400-e29b-41d4-a716-446655440000",
    name: {
      en: "Property 2",
      th: "สินค้า 2",
      ru: "Свойство 2",
    },
    code: "property_2",
    is_locked: false,
    type: "number",
    meta: {
      type: "number",
      min: 0,
      max: 100,
    },
    is_required: false,
    is_private: false,
    is_new: false,
    options: [],
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    group_id: "550e8400-e29b-41d4-a716-446655440000",
    name: {
      en: "Property 3",
      th: "สินค้า 3",
      ru: "Свойство 3",
    },
    code: "property_3",
    is_locked: false,
    type: "option",
    meta: {
      type: "option",
      multi: true,
      sorting: "alphabet",
    },
    is_required: false,
    is_private: false,
    is_new: false,
    options: [
      {
        option_id: "550e8400-e29b-41d4-a716-446655440101",
        property_id: "550e8400-e29b-41d4-a716-446655440003",
        name: {
          en: "Option 1",
          th: "แท็ก 1",
          ru: "Тег 1",
        },
        display_order: 1,
        is_new: false,
      },
      {
        option_id: "550e8400-e29b-41d4-a716-446655440102",
        property_id: "550e8400-e29b-41d4-a716-446655440003",
        name: {
          en: "Option 2",
          th: "แท็ก 2",
          ru: "Тег 2",
        },
        display_order: 2,
        is_new: false,
      },
    ],
  },
];

export function createMockFormData(properties: Property[]): FormData {
  const formData = new FormData();

  properties.forEach((property, index) => {
    // Map property fields to form field names
    formData.append(`items[${index}][id]`, property.id);
    formData.append(`items[${index}][group_id]`, property.group_id || "");
    formData.append(`items[${index}][name][en]`, property.name?.en || "");
    formData.append(`items[${index}][name][th]`, property.name?.th || "");
    formData.append(`items[${index}][name][ru]`, property.name?.ru || "");
    formData.append(`items[${index}][code]`, property.code || "");
    formData.append(`items[${index}][is_locked]`, String(property.is_locked));
    formData.append(`items[${index}][type]`, property.type);
    formData.append(`items[${index}][is_required]`, String(property.is_required));
    formData.append(`items[${index}][is_private]`, String(property.is_private));
    formData.append(`items[${index}][is_new]`, String(property.is_new));

    // Append meta fields based on property type
    if (property.meta) {
      Object.entries(property.meta).forEach(([key, value]) => {
        formData.append(`items[${index}][meta][${key}]`, String(value));
      });
    }

    if (property.options) {
      property.options.forEach((option, optionIndex) => {
        formData.append(`items[${index}][options][${optionIndex}][option_id]`, option.option_id);
        formData.append(`items[${index}][options][${optionIndex}][property_id]`, option.property_id);
        formData.append(`items[${index}][options][${optionIndex}][name][en]`, option.name?.en || "");
        formData.append(`items[${index}][options][${optionIndex}][name][th]`, option.name?.th || "");
        formData.append(`items[${index}][options][${optionIndex}][name][ru]`, option.name?.ru || "");
        formData.append(`items[${index}][options][${optionIndex}][display_order]`, String(option.display_order));
        formData.append(`items[${index}][options][${optionIndex}][is_new]`, String(option.is_new));
      });
    }
  });

  return formData;
}
