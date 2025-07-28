"use client";

import { Plus } from "lucide-react";
import { memo } from "react";
import { Button } from "@shared-ui/shadcn/components/ui/button";
import { useCMSTranslations } from "@cms/i18n/use-cms-translation.hooks";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";
import { useCanvasStore } from "@cms/modules/domain-editor/stores/canvas-store/canvas.store.hooks";
import { makeFormProperty } from "@cms/modules/domain-editor/utils/new-property.utils";

export const TreeAddPropertyButton = memo(function TreeAddPropertyButton() {
  useDebugRender("TreeAddPropertyButton");

  const { t } = useCMSTranslations();
  const store = useCanvasStore();

  const handleAddProperty = () => {
    store.getState().addProperty(makeFormProperty());
  };

  return (
    <Button variant="outline" size="sm" className="text-muted-foreground" onClick={handleAddProperty}>
      <Plus className="h-4 w-4" />
      <span className="text-thin text-xs">{t("add-property")}</span>
    </Button>
  );
});

TreeAddPropertyButton.displayName = "TreeAddPropertyButton";
