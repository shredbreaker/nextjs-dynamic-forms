"use client";

import { Globe } from "lucide-react";
import { useLocale } from "next-intl";
import { memo } from "react";
import { ToggleGroup } from "@shared-ui/shadcn/components/ui/toggle-group";
import { useCMSTranslations } from "@cms/i18n/use-cms-translation.hooks";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";
import { useLayoutStore } from "@cms/modules/domain-editor/stores/layout-store/layout.store.hooks";
import { ToolbarToggleItem } from "@cms/modules/domain-editor/toolbar/toolbar-toggle-item";

export const CanvasTranslationsToggle = memo(function CanvasTranslationsToggle() {
  useDebugRender("CanvasTranslationsToggle");
  const { t } = useCMSTranslations();
  const layoutStore = useLayoutStore();
  const locale = useLocale();

  const showLanguageBar = layoutStore((state) => state.showLanguageBar);
  const currentValue = showLanguageBar ? "language-open" : "language-closed";

  const handleValueChange = (value: string) => {
    const newValue = value === "language-open";
    layoutStore.getState().setShowLanguageBar(newValue);
    if (!newValue) {
      console.log("turning it off");
      layoutStore.getState().setCurrentTranslation(locale);
    }
  };

  const toggleGroupItem = <ToolbarToggleItem value="language-open" icon={Globe} tooltip={t("translations-toggle")} />;

  return (
    <ToggleGroup type="single" value={currentValue} onValueChange={handleValueChange}>
      {toggleGroupItem}
    </ToggleGroup>
  );
});
