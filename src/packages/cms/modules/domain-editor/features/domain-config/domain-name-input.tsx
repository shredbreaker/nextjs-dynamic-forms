/**
 * @fileoverview Domain Name Input - Display and edit domain name
 *
 * 🎯 PURPOSE: Displays domain name with edit button
 *
 * 🏗️ ARCHITECTURE DECISIONS:
 * - Connects to domain store for domain data
 * - Provides edit button for opening domain form
 * - Shows domain status indicators
 * - Includes back button for navigation
 *
 * 🤖 AI GUIDANCE - Component Usage Rules:
 * ✅ USE in domain editor header
 * ✅ CONNECT to domain store for state
 * ✅ PROVIDE edit functionality
 * ✅ SHOW domain status indicators
 *
 * ❌ NEVER mix domain and property concerns
 * ❌ NEVER use outside of domain editor context
 *
 * 📚 REFERENCE: See docs/architecture/domain-editor/hook-patterns.md
 */
"use client";

import { useLocale } from "next-intl";
import { useDomainStore } from "@cms/modules/domain-editor/stores/domain-store";
import { getAvailableLocalizedText } from "@cms/modules/localization/utils/get-available-localized-text";

/**
 * 🏗️ Domain Name Input - Display and edit domain name
 *
 * Component that displays the domain name with an edit button and status indicators.
 * Includes a back button for navigation to the domain list page.
 */
export default function DomainNameInput(): React.JSX.Element {
  const locale = useLocale();

  const domainStore = useDomainStore();
  const domain = domainStore((state) => state.domain);

  // Get domain name in current translation or fallback to code
  const domainName = getAvailableLocalizedText(domain?.name, locale);
  console.log("domainName", domainName);
  return (
    <div className="">
      <p className="text-muted-foreground shrink-1 font-sans text-[clamp(10pt,10vw,8pt)] font-bold whitespace-nowrap">
        {domainName}
      </p>
      {/* <div className="flex min-w-0 items-center justify-center overflow-hidden">
        <p className="text-muted-foreground truncate font-sans text-lg font-bold sm:text-2xl">{domainName}</p>
      </div> */}
    </div>
  );
}
