import { Domain } from "@cms/modules/domains/domain.types";

export const mockDomain: Domain = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  name: {
    en: "Test Domain",
    th: "โดเมนทดสอบ",
    ru: "Тестовый домен",
  },
  code: "test_domain",
  display_order: 1,
  is_active: true,
  is_locked: false,
  meta: {
    system_description: "Test domain for development",
  },
};

export const mockDomains: Domain[] = [
  mockDomain,
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    name: {
      en: "Sales Domain",
      th: "โดเมนการขาย",
      ru: "Домен продаж",
    },
    code: "sales",
    display_order: 2,
    is_active: true,
    is_locked: false,
    meta: {
      system_description: "Domain for sales properties",
    },
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    name: {
      en: "Marketing Domain",
      th: "โดเมนการตลาด",
      ru: "Домен маркетинга",
    },
    code: "marketing",
    display_order: 3,
    is_active: true,
    is_locked: false,
    meta: {
      system_description: "Domain for marketing properties",
    },
  },
];

// Helper function to create mock FormData for testing
export function createMockDomainFormData(domain: Domain): FormData {
  const formData = new FormData();

  // Don't add id field for new domains
  if (domain.code) formData.append("code", domain.code);
  formData.append("is_active", String(domain.is_active));
  formData.append("is_locked", String(domain.is_locked));
  if (domain.display_order !== null) formData.append("display_order", String(domain.display_order));

  // Add meta fields
  if (domain.meta?.system_description) {
    formData.append("meta[system_description]", domain.meta.system_description);
  }

  // Add localized name fields
  if (domain.name) {
    Object.entries(domain.name).forEach(([lang, value]) => {
      if (value) formData.append(`name[${lang}]`, value);
    });
  }

  return formData;
}
