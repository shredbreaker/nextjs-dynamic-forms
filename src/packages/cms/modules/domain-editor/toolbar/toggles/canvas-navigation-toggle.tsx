"use client";

import { AlignEndVertical } from "lucide-react";
import { memo, useEffect } from "react";
import { Button } from "@shared-ui/shadcn/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@shared-ui/shadcn/components/ui/dropdown-menu";
import { ToggleGroup } from "@shared-ui/shadcn/components/ui/toggle-group";
import { useIsMobile } from "@shared-ui/shadcn/hooks/use-mobile";
import { useCMSTranslations } from "@cms/i18n/use-cms-translation.hooks";
import { PropertyNavigation } from "@cms/modules/domain-editor/features/property-tree";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";
import { useLayoutStore } from "@cms/modules/domain-editor/stores/layout-store/layout.store.hooks";
import { ToolbarToggleItem } from "@cms/modules/domain-editor/toolbar/toolbar-toggle-item";

export const CanvasNavigationToggle = memo(function CanvasNavigationToggle() {
  useDebugRender("CanvasNavigationToggle");
  const { t } = useCMSTranslations();
  const layoutStore = useLayoutStore();
  const isMobile = useIsMobile();

  const showPropertiesTree = layoutStore((state) => state.showPropertiesTree);
  const currentValue = showPropertiesTree ? "tree-open" : "tree-closed";

  // Auto-hide tree when switching to mobile
  useEffect(() => {
    if (isMobile && showPropertiesTree) {
      layoutStore.getState().setShowPropertiesTree(false);
    }
  }, [isMobile, showPropertiesTree, layoutStore]);

  const handleValueChange = (value: string) => {
    const newValue = value === "tree-open";
    layoutStore.getState().setShowPropertiesTree(newValue);
  };

  // Mobile dropdown version
  if (isMobile) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:cursor-pointer" aria-label={t("tree-toggle")}>
            <AlignEndVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-h-80 w-72 overflow-y-auto" align="start" side="bottom" sideOffset={4}>
          <div className="p-3">
            <PropertyNavigation variant="mobile" />
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Desktop toggle version
  const toggleGroupItem = <ToolbarToggleItem value="tree-open" icon={AlignEndVertical} tooltip={t("tree-toggle")} />;

  return (
    <ToggleGroup type="single" value={currentValue} onValueChange={handleValueChange}>
      {toggleGroupItem}
    </ToggleGroup>
  );
});
