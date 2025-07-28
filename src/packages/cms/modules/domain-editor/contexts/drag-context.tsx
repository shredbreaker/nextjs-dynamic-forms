/**
 * @fileoverview Drag Context - Drag and drop handle management
 *
 * 🎯 PURPOSE: Provides drag handle props for property reordering
 *
 * 🏗️ ARCHITECTURE DECISIONS:
 * - Single context for drag handle prop distribution
 * - Integrates with @hello-pangea/dnd library
 * - Provides drag handles to property list items
 * - Minimal context scope for performance
 *
 * 🤖 AI GUIDANCE - Drag Context Usage:
 * ✅ USE with PropertyEditorCardList and DragDropContext
 * ✅ WRAP property items that need drag handles
 * ✅ ACCESS with useDragHandleProps hook
 * ✅ PROVIDE drag handles from react-beautiful-dnd
 *
 * ❌ NEVER use outside of drag and drop context
 * ❌ NEVER store other data in this context
 * ❌ NEVER create multiple drag contexts
 *
 * 💡 USAGE PATTERN:
 * ```tsx
 * <DragProvider dragHandleProps={provided.dragHandleProps}>
 *   <PropertyItem /> // Can access drag handles via useDragHandleProps
 * </DragProvider>
 * ```
 *
 * 📚 REFERENCE: See docs/architecture/domain-editor/hook-patterns.md
 */
"use client";

import { DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";
import React, { createContext, useContext, useMemo, memo } from "react";

/**
 * 🎯 Drag Context - Provides drag handle props to child components
 */
const DragContext = createContext<{ dragHandleProps?: DraggableProvidedDragHandleProps | null }>({
  dragHandleProps: null,
});

/**
 * 🎣 Drag Handle Props Hook - Access drag handles from context
 *
 * @returns DraggableProvidedDragHandleProps | null - Drag handle props for the current item
 */
export const useDragHandleProps = () => {
  const { dragHandleProps } = useContext(DragContext);
  return dragHandleProps;
};

/**
 * 🎁 Drag Provider - Supplies drag handle props to children
 *
 * Provider component that makes drag handle props available to child components
 * through the DragContext. Used in property list items for reordering.
 *
 * @param dragHandleProps - Drag handle props from react-beautiful-dnd
 * @param children - Child components that may need drag handles
 */
export const DragProvider = memo(function DragProvider({
  dragHandleProps,
  children,
}: {
  dragHandleProps?: DraggableProvidedDragHandleProps | null;
  children: React.ReactNode;
}) {
  const value = useMemo(() => ({ dragHandleProps }), [dragHandleProps]);

  return <DragContext.Provider value={value}>{children}</DragContext.Provider>;
});
