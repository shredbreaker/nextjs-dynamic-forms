import { LucideIcon } from "lucide-react";
import { memo, useCallback, useContext } from "react";
import { QuickTooltip } from "@shared-ui/components/ui/quick-tooltip";
import { cn } from "@shared-ui/lib/utils";
import { Button } from "@shared-ui/shadcn/components/ui/button";
import { useCMSTranslations } from "@cms/i18n/use-cms-translation.hooks";
import { PropertyRowContext } from "@cms/modules/domain-editor/contexts";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";
import { useCanvasStore } from "@cms/modules/domain-editor/stores/canvas-store/canvas.store.hooks";
import { FormProperty } from "@cms/modules/properties/form/types";

type PropertyToggleButtonProps = {
  propertyKey: keyof Pick<FormProperty, "is_locked" | "is_private" | "is_required">;
  icon: LucideIcon;
  tooltipKey: {
    active: string;
    inactive: string;
  };
  alwaysVisible?: boolean;
};

export const PropertyToggleButton = memo(function PropertyToggleButton({
  propertyKey,
  icon: Icon,
  tooltipKey,
  alwaysVisible = false,
}: PropertyToggleButtonProps) {
  useDebugRender("PropertyToggleButton");

  const { propertyId } = useContext(PropertyRowContext)!;
  const store = useCanvasStore();
  const { t } = useCMSTranslations();

  const setValue = useCallback(
    (draft: FormProperty, value: boolean) => {
      draft[propertyKey] = value;
    },
    [propertyKey],
  );

  const handleChange = useCallback(() => {
    store.getState().updateProperty(propertyId, (draft) => {
      setValue(draft, !draft[propertyKey]);
    });
  }, [propertyId, setValue, store, propertyKey]);

  const isActive = store((state) => state.properties[propertyId]?.[propertyKey]) || false;

  return (
    <QuickTooltip content={isActive ? t(tooltipKey.active) : t(tooltipKey.inactive)}>
      <Button
        variant="ghost"
        size="xs"
        onClick={handleChange}
        className={cn(
          "hover:text-accent-foreground transition-opacity duration-250 hover:bg-transparent dark:hover:bg-transparent",
          isActive ? "opacity-100" : alwaysVisible ? "opacity-100" : "opacity-0 group-hover:opacity-60",
        )}
      >
        <Icon size={13} aria-hidden="true" className={cn(isActive ? "text-primary" : "text-muted-foreground")} />
      </Button>
    </QuickTooltip>
  );
});
