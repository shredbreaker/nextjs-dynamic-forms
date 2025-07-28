import { LocalizedText } from "@cms-data/modules/localization/localization.types";
import { DomainEditor } from "@cms/modules/domain-editor";
import { mockDomain } from "@cms/modules/domains/components/new-domain.mock";
import { Domain } from "@cms/modules/domains/domain.types";
import { mockProperties } from "@cms/modules/properties/property.mock";
import { Property } from "@cms/modules/properties/property.types";

const DOMAIN_NAME: Record<string, LocalizedText> = {
  real_estate: { en: "Real Estate Listings", th: "รายการอสังหาริมทรัพย์", ru: "Недвижимость" },
  restaurant: { en: "Restaurant Menu", th: "เมนูร้านอาหาร", ru: "Меню ресторана" },
  event_management: { en: "Event Management", th: "ระบบจัดการกิจกรรม", ru: "Система управления мероприятиями" },
  e_commerce: { en: "E-commerce Product Catalog", th: "รายการสินค้าออนไลน์", ru: "Каталог электронной коммерции" },
  news: { en: "News Publishing System", th: "ระบบสำรวจข่าว", ru: "Система публикации новостей" },
  online_course: { en: "Online Course Platform", th: "ระบบออนไลน์สอน", ru: "Система онлайн-курсов" },
  streaming_show: { en: "Streaming Service CMS", th: "ระบบจัดการสด", ru: "Система управления потоковыми шоу" },
  hotels: { en: "Hotel Room CMS", th: "ระบบจัดการห้องพัก", ru: "Система управления номерами отелей" },
};

export default async function DomainEditorPage({ params }: { params: Promise<{ domain_id: string }> }) {
  const { domain_id } = await params;

  const availableDomainId = DOMAIN_NAME[domain_id] != null ? domain_id : "event_management";
  console.log("----", availableDomainId);
  const domain: Domain = mockDomain;
  domain.id = availableDomainId;
  domain.name = DOMAIN_NAME[availableDomainId] || {};

  const properties: Property[] = await getMockProperties(availableDomainId);
  return (
    <div>
      <DomainEditor properties={properties} domain={domain} />
    </div>
  );
}

async function getMockProperties(domain_id: string): Promise<Property[]> {
  const file = await import(`@/app/mocks/${domain_id}.json`);
  return file.default;
}
