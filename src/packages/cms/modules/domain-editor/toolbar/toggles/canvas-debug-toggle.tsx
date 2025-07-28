"use client";

import { Braces } from "lucide-react";
import { memo } from "react";
import { ToggleGroup } from "@shared-ui/shadcn/components/ui/toggle-group";
import { useCMSTranslations } from "@cms/i18n/use-cms-translation.hooks";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";
import { useLayoutStore } from "@cms/modules/domain-editor/stores/layout-store/layout.store.hooks";
import { ToolbarToggleItem } from "@cms/modules/domain-editor/toolbar/toolbar-toggle-item";

export const CanvasDebugToggle = memo(function CanvasDebugToggle() {
  useDebugRender("CanvasDebugToggle");
  const { t } = useCMSTranslations();
  const layoutStore = useLayoutStore();

  const showDebugCard = layoutStore((state) => state.showDebugCard);

  const currentValue = showDebugCard ? "debug-open" : "debug-closed";

  const handleValueChange = (value: string) => {
    const newValue = value === "debug-open";
    layoutStore.getState().setShowDebugCard(newValue);
  };

  const toggleGroupItem = <ToolbarToggleItem value="debug-open" icon={Braces} tooltip={t("debug-toggle")} />;

  return (
    <ToggleGroup type="single" value={currentValue} onValueChange={handleValueChange} className="disabled:opacity-50">
      {toggleGroupItem}
    </ToggleGroup>
  );
});
