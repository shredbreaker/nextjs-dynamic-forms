"use client";

import { Settings } from "lucide-react";
import { memo } from "react";
import { ToggleGroup } from "@shared-ui/shadcn/components/ui/toggle-group";
import { useCMSTranslations } from "@cms/i18n/use-cms-translation.hooks";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";
import { useLayoutStore } from "@cms/modules/domain-editor/stores/layout-store/layout.store.hooks";
import { ToolbarToggleItem } from "@cms/modules/domain-editor/toolbar/toolbar-toggle-item";

export const CanvasPropertySettingsToggle = memo(function CanvasPropertySettingsToggle() {
  useDebugRender("CanvasPropertySettingsToggle");
  const { t } = useCMSTranslations();
  const layoutStore = useLayoutStore();

  const showAdvancedSettings = layoutStore((state) => state.showAdvancedSettings);
  const currentValue = showAdvancedSettings ? "settings-open" : "settings-closed";

  const handleValueChange = (value: string) => {
    const newValue = value === "settings-open";
    layoutStore.getState().setShowAdvancedSettings(newValue);
  };

  const toggleGroupItem = <ToolbarToggleItem value="settings-open" icon={Settings} tooltip={t("settings-toggle")} />;

  return (
    <ToggleGroup type="single" value={currentValue} onValueChange={handleValueChange}>
      {toggleGroupItem}
    </ToggleGroup>
  );
});
