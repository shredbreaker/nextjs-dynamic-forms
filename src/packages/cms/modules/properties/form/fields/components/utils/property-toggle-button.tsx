import type { LucideIcon } from "lucide-react";
import { memo } from "react";
import { QuickTooltip } from "@shared-ui/components/ui/quick-tooltip";
import { cn } from "@shared-ui/lib/utils";
import { Button } from "@shared-ui/shadcn/components/ui/button";
import { useCMSTranslations } from "@cms/i18n/use-cms-translation.hooks";
import { usePropertyBoolToggle } from "@cms/modules/properties/form/fields/hooks/utils/use-bool";
import type { FormProperty } from "@cms/modules/properties/form/types";

export interface PropertyToggleButtonProps {
  propertyKey: keyof Pick<FormProperty, "is_locked" | "is_private" | "is_required">;
  icon: LucideIcon;
  tooltipKey: { active: string; inactive: string };
  alwaysVisible?: boolean;
  className?: string;
}

export const PropertyToggleButton = memo(function PropertyToggleButton({
  propertyKey,
  icon: Icon,
  tooltipKey,
  alwaysVisible = true,
  className,
}: PropertyToggleButtonProps) {
  const { t } = useCMSTranslations();
  const { isActive, handleToggle } = usePropertyBoolToggle(propertyKey);

  return (
    <QuickTooltip content={isActive ? t(tooltipKey.active) : t(tooltipKey.inactive)}>
      <Button
        variant="ghost"
        size="xs"
        onClick={handleToggle}
        className={cn(
          "hover:text-accent-foreground transition-opacity duration-250 hover:bg-transparent dark:hover:bg-transparent",
          isActive ? "opacity-100" : alwaysVisible ? "opacity-100" : "opacity-20 group-hover:opacity-60",
          className,
        )}
        aria-pressed={isActive}
        type="button"
        role="button"
      >
        <Icon size={13} aria-hidden="true" className={cn(isActive ? "text-primary" : "text-muted-foreground")} />
      </Button>
    </QuickTooltip>
  );
});

PropertyToggleButton.displayName = "PropertyToggleButton";
