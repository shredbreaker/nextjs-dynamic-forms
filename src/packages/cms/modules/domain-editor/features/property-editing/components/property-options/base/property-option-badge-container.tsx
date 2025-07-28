/**
 * @fileoverview Property Option Badge Container
 *
 * 🎯 PURPOSE: Main container for badge-style property options interface
 *
 * 🏗️ ARCHITECTURE DECISIONS:
 * - Vertical scrolling layout with flex-wrap for multiple rows
 * - Dynamic badge widths with max-width limiter for long texts
 * - Fixed height container showing ~2 badge rows (80px)
 * - Auto-scroll to bottom when new options are added
 * - Integrates with existing property options data flow
 * - Provides expand button for full management popup
 *
 * 🎨 UX IMPROVEMENTS (Phase 1.1):
 * - Dynamic badge widths: content-based with max-width for long text
 * - Vertical scrolling: shows 2 badge heights, wraps to multiple rows
 * - Text overflow: ellipsis for very long option names
 * - Proper spacing: gap between badges for clean layout
 *
 * 🤖 AI GUIDANCE - Badge Container Usage:
 * ✅ USE as main interface for badge-style options management
 * ✅ VERTICAL scrolling with flex-wrap for multiple rows
 * ✅ DYNAMIC badge sizing with max-width constraints
 * ✅ EXPAND button for advanced management features
 *
 * ❌ NEVER render without PropertyRowContext (needs propertyId)
 * ❌ NEVER break existing option ordering patterns
 * ❌ NEVER hide add field from scroll view
 *
 * 🔄 CONTAINER FLOW:
 * 1. Load ordered options via useOrderedPropertyOptions
 * 2. Render each option as dynamic-width badge with overflow handling
 * 3. Add PropertyOptionBadgeAddField at end for new options
 * 4. Auto-scroll to bottom to keep add field visible
 * 5. Provide expand button for full management popup
 * 6. Handle vertical scrolling with smooth behavior
 *
 * 📚 REFERENCE: Combines existing option patterns with improved badge UX design
 */
"use client";

import { Maximize2 } from "lucide-react";
import { memo, useCallback, useContext, useEffect, useRef, useState } from "react";
import { QuickTooltip } from "@shared-ui/components/ui/quick-tooltip";
import { Button } from "@shared-ui/shadcn/components/ui/button";
import { PropertyRowContext } from "@cms/modules/domain-editor/contexts";
import { useOrderedPropertyOptions } from "@cms/modules/domain-editor/features/property-editing";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";
import { PropertyOptionBadgeAddField } from "./property-option-badge-add-field";
import { PropertyOptionBadgeItemWithConfirmation } from "./property-option-badge-item-with-confirmation";
import { PropertyOptionManagementDialog } from "./property-option-management-dialog";

/**
 * 🏷️ Property Option Badge Container
 *
 * Main container component that provides improved badge-style interface for property options.
 * Features dynamic badge sizing and vertical scrolling for better UX.
 *
 * Features:
 * - Vertical scrolling with fixed height (~2 badge rows)
 * - Dynamic badge widths with max-width constraints
 * - Flex-wrap layout for multiple rows
 * - Auto-scroll to bottom to keep add field visible
 * - Ordered option display using useOrderedPropertyOptions
 * - Delete confirmation for individual options
 * - Add new options workflow with Enter key support
 * - Expand button for full management popup access
 * - Text overflow handling for long option names
 *
 * @example
 * ```tsx
 * <PropertyRowProvider propertyId="prop-123">
 *   <PropertyOptionBadgeContainer />
 * </PropertyRowProvider>
 * ```
 */
export const PropertyOptionBadgeContainer = memo(function PropertyOptionBadgeContainer() {
  useDebugRender("PropertyOptionBadgeContainer");

  const { propertyId } = useContext(PropertyRowContext)!;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // 📊 Get ordered options using existing hook
  const orderedOptions = useOrderedPropertyOptions(propertyId);

  /**
   * 📜 Auto-scroll to Bottom
   *
   * Scrolls the container to show the add field after new options are created.
   * Uses smooth scrolling for better user experience.
   */
  const scrollToAddField = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, []);

  /**
   * 🎨 Handle Expand to Full Management
   *
   * Opens the full management popup for advanced option management.
   */
  const handleExpand = useCallback(() => {
    setDialogOpen(true);
  }, []);

  // 🔄 Auto-scroll when options change (new option added)
  useEffect(() => {
    // Small delay to ensure DOM is updated before scrolling
    const timeoutId = setTimeout(() => {
      scrollToAddField();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [orderedOptions.length, scrollToAddField]);

  return (
    <>
      <div className="relative flex w-full items-start gap-2">
        {/* 🏷️ Vertical scrolling badge container with flex-wrap */}
        <div
          ref={scrollRef}
          className="flex h-20 flex-1 flex-wrap content-start items-start gap-2 overflow-y-auto scroll-smooth pr-1"
          style={{ scrollbarWidth: "thin" }}
          data-testid="property-option-badge-container"
        >
          {/* 📋 Existing option badges with dynamic sizing */}
          {orderedOptions.map((option) => (
            <div key={option.option_id} className="shrink-0">
              <PropertyOptionBadgeItemWithConfirmation propertyId={propertyId} optionId={option.option_id} />
            </div>
          ))}

          {/* 🆕 Add new option field */}
          <div className="shrink-0">
            <PropertyOptionBadgeAddField propertyId={propertyId} />
          </div>
        </div>

        {/* 🔍 Expand to full management button */}
        <div className="mt-0 shrink-0">
          <QuickTooltip content="Expand to full management">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleExpand}
              className="hover:bg-muted/50 h-8 w-8"
              data-testid="property-option-badge-expand"
            >
              <Maximize2 className="text-muted-foreground h-4 w-4" />
            </Button>
          </QuickTooltip>
        </div>
      </div>

      {/* 🎛️ Property Option Management Dialog */}
      <PropertyOptionManagementDialog propertyId={propertyId} open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
});

PropertyOptionBadgeContainer.displayName = "PropertyOptionBadgeContainer";
