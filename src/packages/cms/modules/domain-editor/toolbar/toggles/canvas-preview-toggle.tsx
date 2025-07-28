"use client";

import { Eye } from "lucide-react";
import { memo } from "react";
import { ToggleGroup } from "@shared-ui/shadcn/components/ui/toggle-group";
import { useCMSTranslations } from "@cms/i18n/use-cms-translation.hooks";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";
import { useLayoutStore } from "@cms/modules/domain-editor/stores/layout-store/layout.store.hooks";
import { ToolbarToggleItem } from "@cms/modules/domain-editor/toolbar/toolbar-toggle-item";

export const CanvasPreviewToggle = memo(function CanvasPreviewToggle() {
  useDebugRender("CanvasPreviewToggle");
  const { t } = useCMSTranslations();
  const layoutStore = useLayoutStore();

  const showPreview = layoutStore((state) => state.showPreview);
  const currentValue = showPreview ? "preview-open" : "preview-closed";

  const handleValueChange = (value: string) => {
    const newValue = value === "preview-open";
    layoutStore.getState().setShowPreview(newValue);
  };

  const toggleGroupItem = <ToolbarToggleItem value="preview-open" icon={Eye} tooltip={t("preview-toggle")} />;

  return (
    <ToggleGroup type="single" value={currentValue} onValueChange={handleValueChange}>
      {toggleGroupItem}
    </ToggleGroup>
  );
});
