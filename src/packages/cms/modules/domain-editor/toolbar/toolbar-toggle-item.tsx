import { LucideIcon } from "lucide-react";
import { QuickTooltip } from "@shared-ui/components/ui/quick-tooltip";
import { cn } from "@shared-ui/lib/utils";
import { ToggleGroupItem } from "@shared-ui/shadcn/components/ui/toggle-group";

interface ToolbarToggleItemProps {
  value: string;
  icon: LucideIcon;
  tooltip: string;
  className?: string;
}

export const ToolbarToggleItem = ({ value, icon: Icon, tooltip, className }: ToolbarToggleItemProps) => {
  return (
    /**
     * ⚠️ CRITICAL COMPOSITION PATTERN - DO NOT MODIFY
     *
     * QuickTooltip requires div wrapper for proper positioning.
     * Any structural changes will break tooltip functionality.
     * Protected by: __tests__/composition-integrity/tooltip-wrapper.test.tsx
     */
    <QuickTooltip content={tooltip}>
      <div>
        <ToggleGroupItem
          value={value}
          suppressHydrationWarning={true}
          className={cn(
            "h-8 w-8 hover:cursor-pointer data-[state=on]:bg-blue-200 data-[state=on]:text-blue-900 dark:data-[state=on]:bg-blue-900 dark:data-[state=on]:text-blue-100",
            className,
          )}
        >
          <Icon className="h-6 w-6" />
        </ToggleGroupItem>
      </div>
    </QuickTooltip>
  );
};
