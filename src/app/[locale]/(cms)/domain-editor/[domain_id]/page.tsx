import { MOCK_DOMAIN_NAMES } from "@/app/mocks/mock-name";
import { DomainEditor } from "@cms/modules/domain-editor";
import { mockDomain } from "@cms/modules/domains/components/new-domain.mock";
import { Domain } from "@cms/modules/domains/domain.types";
import { Property } from "@cms/modules/properties/property.types";

export default async function DomainEditorPage({ params }: { params: Promise<{ domain_id: string }> }) {
  const { domain_id } = await params;

  const availableDomainId = MOCK_DOMAIN_NAMES[domain_id] != null ? domain_id : "event_management";
  const domain: Domain = mockDomain;
  domain.id = availableDomainId;
  domain.name = MOCK_DOMAIN_NAMES[availableDomainId] || {};

  const properties: Property[] = await getMockProperties(availableDomainId);
  return (
    <div>
      <DomainEditor properties={properties} domain={domain} />
    </div>
  );
}

async function getMockProperties(domain_id: string): Promise<Property[]> {
  const file = await import(`@/app/mocks/json/${domain_id}.json`);
  return file.default;
}
