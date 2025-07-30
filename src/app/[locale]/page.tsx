"use client";

import {
  BookOpenIcon,
  CalendarIcon,
  HomeIcon,
  NewspaperIcon,
  ShoppingCartIcon,
  UtensilsIcon,
  VideoIcon,
  HotelIcon,
} from "lucide-react";
import { useLocale } from "next-intl";
import { useCallback } from "react";
import { MOCK_DOMAIN_NAMES } from "@/app/mocks/mock-name";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { useAppTranslations } from "@/i18n/app-translation.hooks";
import { Link } from "@/i18n/navigation";
export default function HomePage() {
  const domainIds = Object.keys(MOCK_DOMAIN_NAMES);
  const locale = useLocale();
  const { t } = useAppTranslations("homepage");

  const iconForDomain = useCallback((id: string) => {
    switch (id) {
      case "real_estate":
        return <HomeIcon />;
      case "restaurant":
        return <UtensilsIcon />;
      case "event_management":
        return <CalendarIcon />;
      case "e_commerce":
        return <ShoppingCartIcon />;
      case "news":
        return <NewspaperIcon />;
      case "online_course":
        return <BookOpenIcon />;
      case "streaming_show":
        return <VideoIcon />;
      case "hotels":
        return <HotelIcon />;
    }
  }, []);

  const links = domainIds.map((id) => ({
    href: `/domain-editor/${id}`,
    label: MOCK_DOMAIN_NAMES[id]?.[locale] ?? "",
    icon: iconForDomain(id),
  }));

  return (
    <div className="bg-muted relative flex h-dvh w-full flex-col items-center justify-start space-y-6 overflow-auto">
      {/* Header with Logo and Switchers */}
      <div className="w-full">
        <Header />
      </div>
      <div className="flex flex-col items-center justify-center space-y-4">
        <span className="text-muted-foreground px-20 py-2 text-center text-2xl font-semibold">{t("title")}</span>
        <nav className="flex">
          <ul className="bg-card flex flex-col space-y-2 rounded-xl p-8 py-2 shadow-xl">
            {links.map((link) => (
              <li key={link.href} className="px-4 py-1 transition-all duration-200 hover:scale-105">
                <Link className="flex flex-row items-center justify-between space-x-4" href={link.href}>
                  {link.icon}
                  <div className="w-full text-left">{link.label}</div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <Footer />
    </div>
  );
}
