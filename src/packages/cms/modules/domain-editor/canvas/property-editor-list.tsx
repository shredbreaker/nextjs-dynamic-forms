"use client";

import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import React, { memo } from "react";
import { cn } from "@shared-ui/lib/utils";
import { DragProvider, PropertyRowProvider } from "@cms/modules/domain-editor/contexts";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";
import { useOrderedPropertyIds } from "@cms/modules/domain-editor/hooks/use-property";
import { useCanvasStore } from "@cms/modules/domain-editor/stores/canvas-store/canvas.store.hooks";
import { useLayoutStore } from "@cms/modules/domain-editor/stores/layout-store/layout.store.hooks";
import { PropertyIdProvider } from "@cms/modules/properties/form/contexts";
import { PropertyEditorCardRow } from "./property-editor-row";
// TODO: Re-enable these imports when migrating to new PropertyStore architecture
// import type { FormProperty } from "@cms/modules/properties/form/types";
// import {
//   PropertyStoreProvider,
//   PropertyIdProvider,
// } from "@cms/modules/properties/components/form/contexts/property-store.context";
// import type { Property } from "@cms/modules/properties/property.types";
// import { PropertyEditorCardRow } from "./property-editor-row";

export const PropertyEditorCardList = memo(function PropertyEditorCardList() {
  useDebugRender("PropertyEditorCardList");
  const propertyIds = useOrderedPropertyIds();
  const store = useCanvasStore();
  const layoutStore = useLayoutStore();
  const showPreview = layoutStore((state) => state.showPreview);

  /**
   * 🎯 Handle Drag End - Property and option reordering
   *
   * Handles drag end events for both property reordering in the main list
   * and option reordering within individual properties.
   */
  const onDragEnd = (result: DropResult) => {
    if (!result.destination || result.source.index === result.destination.index) {
      return;
    }

    const { source, destination } = result;

    // Handle property reordering (main list)
    if (source.droppableId === "property-list") {
      store.getState().reorderProperties(source.index, destination.index);
      return;
    }

    // Handle option reordering within properties
    if (source.droppableId.startsWith("property-options-") && destination.droppableId === source.droppableId) {
      const propertyId = source.droppableId.replace("property-options-", "");
      store.getState().updatePropertyOptions(propertyId, (draft) => {
        // Get current ordered option IDs
        const orderedOptions = Object.values(draft).sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

        if (
          source.index < 0 ||
          source.index >= orderedOptions.length ||
          destination.index < 0 ||
          destination.index >= orderedOptions.length
        ) {
          return;
        }

        // Reorder the array
        const [movedOption] = orderedOptions.splice(source.index, 1);
        orderedOptions.splice(destination.index, 0, movedOption);

        // Update display_order values
        orderedOptions.forEach((option, index) => {
          draft[option.option_id].display_order = index;
        });
      });
    }
  };

  return (
    <div className="">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="property-list">
          {(provided, snapshot) => (
            // No gaps here between the items due to drag and drop (set mb inside the item)
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={cn("relative z-10 flex flex-col", snapshot.isDraggingOver && "bg-blue-50/50")}
            >
              {propertyIds.length > 0 &&
                propertyIds.map((propertyId, index) => (
                  <PropertyListItem
                    key={propertyId}
                    propertyId={propertyId}
                    index={index}
                    className={cn(
                      showPreview
                        ? "border-primary/40 rounded-b-none border-dashed pb-4 not-first:pt-1 not-last:border-b-1"
                        : "",
                    )}
                  />
                ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
});

/**
 * 🏷️ Property List Item - Individual draggable property item
 *
 * Wrapper component that handles draggable behavior for individual properties.
 * Provides drag and drop functionality while maintaining proper memoization.
 */
const PropertyListItem = memo(function PropertyListItem({
  propertyId,
  index,
  className,
}: {
  propertyId: string;
  index: number;
  className?: string;
}) {
  useDebugRender("PropertyListItem");
  return (
    <Draggable key={propertyId} draggableId={propertyId} index={index}>
      {(provided, snapshot) => (
        <div
          {...provided.draggableProps}
          ref={provided.innerRef}
          className={cn("mb-3 px-0", snapshot.isDragging && "z-50 opacity-80", className)}
        >
          <DragProvider dragHandleProps={provided.dragHandleProps}>
            <PropertyRowProvider propertyId={propertyId}>
              <PropertyIdProvider propertyId={propertyId}>
                <PropertyEditorCardRow />
              </PropertyIdProvider>
            </PropertyRowProvider>
          </DragProvider>
        </div>
      )}
    </Draggable>
  );
});
