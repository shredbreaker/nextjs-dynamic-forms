"use client";

import { Droppable } from "@hello-pangea/dnd";
import { memo, useContext, useState } from "react";
import { cn } from "@shared-ui/lib/utils";
import { Button } from "@shared-ui/shadcn/components/ui/button";
import { PropertyRowContext } from "@cms/modules/domain-editor/contexts";
import { useOrderedPropertyOptions } from "@cms/modules/domain-editor/features/property-editing";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";
import { PropertyOptionAddItem } from "./option-add-item";
import { MemoizedPropertyOptionItem } from "./option-item";

export const PropertyOptionList = memo(function PropertyOptionList() {
  useDebugRender("PropertyOptionList");
  const { propertyId } = useContext(PropertyRowContext)!;
  const orderedOptions = useOrderedPropertyOptions(propertyId);
  const [showAll, setShowAll] = useState(false);

  // Performance optimization: only show first 5 options initially
  const INITIAL_VISIBLE_COUNT = 5;
  const shouldLimitOptions = orderedOptions.length > INITIAL_VISIBLE_COUNT && !showAll;
  const visibleOptions = shouldLimitOptions ? orderedOptions.slice(0, INITIAL_VISIBLE_COUNT) : orderedOptions;
  const hiddenCount = orderedOptions.length - INITIAL_VISIBLE_COUNT;

  return (
    <Droppable droppableId={`property-options-${propertyId}`} type="option">
      {(provided, snapshot) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className={cn("flex w-full flex-col space-y-1", snapshot.isDraggingOver && "bg-muted/30")}
          data-testid="property-option-list-container"
        >
          {visibleOptions.map((option, index) => (
            <MemoizedPropertyOptionItem
              key={option.option_id}
              propertyId={propertyId}
              optionId={option.option_id}
              index={index}
            />
          ))}

          {/* Show more button for performance */}
          {shouldLimitOptions && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAll(true)}
              className="text-muted-foreground hover:text-foreground"
            >
              Show {hiddenCount} more options...
            </Button>
          )}

          {provided.placeholder}

          {/* Add Option Item */}
          <PropertyOptionAddItem />
        </div>
      )}
    </Droppable>
  );
});
