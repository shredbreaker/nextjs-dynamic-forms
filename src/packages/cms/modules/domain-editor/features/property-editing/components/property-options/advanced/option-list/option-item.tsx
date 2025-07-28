"use client";

import { Draggable } from "@hello-pangea/dnd";
import { GripVertical } from "lucide-react";
import { memo, useMemo, useRef } from "react";
import { cn } from "@shared-ui/lib/utils";
import { PropertyOptionContextMenu } from "@cms/modules/domain-editor/features/property-editing/components/property-options/advanced/option-meta/context-menu";
import { PropertyOptionCodeInput } from "@cms/modules/domain-editor/features/property-editing/components/property-options/advanced/option-meta/option-code-input";
import { PropertyOptionNameInput } from "@cms/modules/domain-editor/features/property-editing/components/property-options/advanced/option-meta/option-name-input";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";
import { useLayoutStore } from "@cms/modules/domain-editor/stores/layout-store/layout.store";

// Memoized draggable content
export const MemoizedPropertyOptionItem = memo(
  function MemoizedPropertyOptionItem({
    propertyId,
    optionId,
    index,
  }: {
    propertyId: string;
    optionId: string;
    index: number;
  }) {
    useDebugRender("MemoizedPropertyOptionItem");

    const layoutStore = useLayoutStore();
    const showPropertyCode = layoutStore((state) => state.showPropertyCode);

    // Stable references to prevent unnecessary re-renders
    const stableRefs = useRef({ propertyId, optionId });
    stableRefs.current = { propertyId, optionId };

    const DraggableContent = useMemo(
      () => (
        <div className="flex-1">
          {showPropertyCode ? (
            <div className="flex w-full flex-col space-y-0">
              <PropertyOptionCodeInput
                propertyId={stableRefs.current.propertyId}
                optionId={stableRefs.current.optionId}
              />
              <PropertyOptionNameInput
                propertyId={stableRefs.current.propertyId}
                optionId={stableRefs.current.optionId}
              />
            </div>
          ) : (
            <PropertyOptionNameInput
              propertyId={stableRefs.current.propertyId}
              optionId={stableRefs.current.optionId}
            />
          )}
        </div>
      ),
      [showPropertyCode], // Removed propertyId, optionId from deps since they're stable
    );

    return (
      <Draggable draggableId={`option-${optionId}`} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={cn(
              "bg-muted/50 flex w-full items-center rounded-md p-2 pb-0",
              snapshot.isDragging && "z-50 opacity-80",
            )}
            data-testid={`property-option-item-${optionId}`}
          >
            <div
              {...provided.dragHandleProps}
              className="text-muted-foreground hover:text-foreground mr-2 flex h-4 w-4 cursor-grab items-center justify-center transition-colors active:cursor-grabbing"
            >
              <GripVertical className="text-muted-foreground h-4 w-4 opacity-60" />
            </div>
            {DraggableContent}
            <div className="relative">
              <PropertyOptionContextMenu propertyId={propertyId} optionId={optionId} />
            </div>
          </div>
        )}
      </Draggable>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.propertyId === nextProps.propertyId &&
      prevProps.optionId === nextProps.optionId &&
      prevProps.index === nextProps.index
    );
  },
);
