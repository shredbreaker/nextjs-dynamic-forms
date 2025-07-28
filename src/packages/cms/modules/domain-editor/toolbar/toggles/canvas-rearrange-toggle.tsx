"use client";

import { GripVertical } from "lucide-react";
import { memo } from "react";
import { ToggleGroup } from "@shared-ui/shadcn/components/ui/toggle-group";
import { useCMSTranslations } from "@cms/i18n/use-cms-translation.hooks";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";
import { useLayoutStore } from "@cms/modules/domain-editor/stores/layout-store/layout.store.hooks";
import { ToolbarToggleItem } from "@cms/modules/domain-editor/toolbar/toolbar-toggle-item";

export const CanvasRearrangeToggle = memo(function CanvasRearrangeToggle() {
  useDebugRender("CanvasRearrangeToggle");
  const { t } = useCMSTranslations();
  const layoutStore = useLayoutStore();

  const rearrangeToggleActive = layoutStore((state) => state.rearrangeToggleActive);
  const currentValue = rearrangeToggleActive ? "rearrange-open" : "rearrange-closed";

  const handleValueChange = (value: string) => {
    const newValue = value === "rearrange-open";
    layoutStore.getState().setRearrangeToggleActive(newValue);
  };

  const toggleGroupItem = (
    <ToolbarToggleItem value="rearrange-open" icon={GripVertical} tooltip={t("rearrange-toggle")} />
  );

  return (
    <ToggleGroup type="single" value={currentValue} onValueChange={handleValueChange}>
      {toggleGroupItem}
    </ToggleGroup>
  );
});
