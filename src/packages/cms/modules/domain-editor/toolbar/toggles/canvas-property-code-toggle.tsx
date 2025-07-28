"use client";

import { Hash } from "lucide-react";
import { memo } from "react";
import { ToggleGroup } from "@shared-ui/shadcn/components/ui/toggle-group";
import { useCMSTranslations } from "@cms/i18n/use-cms-translation.hooks";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";
import { useLayoutStore } from "@cms/modules/domain-editor/stores/layout-store/layout.store.hooks";
import { ToolbarToggleItem } from "@cms/modules/domain-editor/toolbar/toolbar-toggle-item";

export const CanvasPropertyCodeToggle = memo(function CanvasPropertyCodeToggle() {
  useDebugRender("CanvasPropertyCodeToggle");
  const { t } = useCMSTranslations();
  const layoutStore = useLayoutStore();

  const showPropertyCode = layoutStore((state) => state.showPropertyCode);
  const currentValue = showPropertyCode ? "code-open" : "code-closed";

  const handleValueChange = (value: string) => {
    const newValue = value === "code-open";
    layoutStore.getState().setShowPropertyCode(newValue);
  };

  const toggleGroupItem = <ToolbarToggleItem value="code-open" icon={Hash} tooltip={t("code-toggle")} />;

  return (
    <ToggleGroup type="single" value={currentValue} onValueChange={handleValueChange}>
      {toggleGroupItem}
    </ToggleGroup>
  );
});
