import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@shared-ui/shadcn/components/ui/tooltip";
import { useIsMobile } from "@shared-ui/shadcn/hooks/use-mobile";

export function QuickTooltip({
  content,
  children,
  delay = 200, // default delay in ms
  open,
  onOpenChange,
}: {
  content: React.ReactNode;
  children?: React.ReactNode;
  delay?: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <>{children}</>;
  }

  return (
    <TooltipProvider>
      <Tooltip delayDuration={delay} disableHoverableContent open={open} onOpenChange={onOpenChange}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          side="top"
          align="center"
          style={{ pointerEvents: "none" }}
          // Hide on mobile devices that don't support hover
          className="[@media(hover:none)]:hidden"
        >
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
