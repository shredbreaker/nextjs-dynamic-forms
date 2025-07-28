"use client";

import { useLocale } from "next-intl";
import { memo } from "react";
import { CMSTranslationContextProvider } from "@cms/i18n/use-cms-translation.hooks";
import { Domain } from "@cms/modules/domains/domain.types";
import { Property } from "@cms/modules/properties/property.types";
import { DomainLayout } from "./components";
import { useDebugRender } from "./hooks";
import { CanvasStoreProvider } from "./stores/canvas-store/canvas.store.context";
import { DomainStoreProvider } from "./stores/domain-store/domain.store.context";
import { LayoutStoreProvider } from "./stores/layout-store/layout.store.context";

interface DomainEditorProps {
  properties: Property[];
  domain: Domain;
}

export const DomainEditor = memo(function DomainEditor({ properties, domain }: DomainEditorProps) {
  const locale = useLocale();

  useDebugRender("DomainEditor");

  return (
    <CMSTranslationContextProvider namespace="domain_editor">
      <LayoutStoreProvider locale={locale}>
        <DomainStoreProvider initialDomain={domain}>
          <CanvasStoreProvider domainId={domain.id} locale={locale} initialProperties={properties ?? []}>
            <DomainLayout />
          </CanvasStoreProvider>
        </DomainStoreProvider>
      </LayoutStoreProvider>
    </CMSTranslationContextProvider>
  );
});
