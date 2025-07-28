import { DomainEditor } from "@cms/modules/domain-editor";
import { mockDomain } from "@cms/modules/domains/components/new-domain.mock";
import { Domain } from "@cms/modules/domains/domain.types";
import { mockProperties } from "@cms/modules/properties/property.mock";
import { Property } from "@cms/modules/properties/property.types";

export default async function DomainEditorPage({ params }: { params: Promise<{ domain_id: string }> }) {
  const { domain_id } = await params;

  const domain: Domain = mockDomain;
  domain.id = domain_id;

  const properties: Property[] = mockProperties;
  return (
    <div>
      <DomainEditor properties={properties} domain={domain} />
    </div>
  );
}
