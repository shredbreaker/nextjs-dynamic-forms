/**
 * @fileoverview Canvas Toolbar - Main toolbar for domain editor controls
 *
 * 🎯 PURPOSE: Central toolbar providing domain editor navigation and control toggles
 *
 * 🏗️ ARCHITECTURE DECISIONS:
 * - Horizontal layout with responsive design
 * - Toggle components for UI state management
 * - Integrates with layout store for toggle states
 * - Positioned in navigation sidebar for easy access
 *
 * 🤖 AI GUIDANCE - Canvas Toolbar Usage:
 * ✅ USE in navigation areas for editor controls
 * ✅ INTEGRATE with layout store for toggle state
 * ✅ COMPOSE toggle components for modular design
 * ✅ MAINTAIN responsive layout for different screen sizes
 *
 * ❌ NEVER manage toggle state locally (use layout store)
 * ❌ NEVER render without layout store context
 * ❌ NEVER hardcode toolbar layout (use responsive design)
 *
 * 🎛️ TOGGLE COMPONENTS:
 * - CanvasNavigationToggle - Shows/hides property navigation
 * - CanvasPropertySettingsToggle - Shows/hides property settings panel
 * - CanvasPropertyCodeToggle - Shows/hides property code view
 * - CanvasTranslationsToggle - Shows/hides translation interface
 * - CanvasPreviewToggle - Shows/hides property preview mode
 *
 * 📚 REFERENCE: See docs/architecture/domain-editor/hook-patterns.md
 */
"use client";

import { memo } from "react";
import { cn } from "@shared-ui/lib/utils";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";
import {
  CanvasPreviewToggle,
  CanvasPropertyCodeToggle,
  CanvasPropertySettingsToggle,
  CanvasTranslationsToggle,
  CanvasNavigationToggle,
  CanvasRearrangeToggle,
  CanvasDebugToggle,
} from "./toggles";

/**
 * 📏 Toolbar Separator - Visual separator for toolbar sections
 *
 * Creates a vertical line separator between toolbar sections for visual grouping.
 * Adapts to light/dark themes for consistent appearance.
 */
function ToolbarSeparator() {
  return <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />;
}

/**
 * 🎨 Toolbar Container - Styled container for toolbar items
 *
 * Provides Canva-style container with ring border and shadow for toolbar items.
 * Creates consistent visual grouping for toolbar components.
 */
function Toolbar({ children }: { children: React.ReactNode }) {
  return <div className="ring-accent rounded-lg p-1 shadow-md ring-1">{children}</div>;
}

/**
 * 🛠️ Canvas Toolbar - Main editor controls toolbar
 *
 * Central toolbar component that provides the main controls for the domain editor.
 * Contains toggle components for various UI states and editor features.
 *
 * Features:
 * - Property tree navigation toggle
 * - Property settings and code view toggles
 * - Translation interface toggle
 * - Preview mode toggle
 * - Canva-style toolbar design with separators
 *
 * @example
 * ```tsx
 * // In navigation sidebar
 * <div className="border-b p-2">
 *   <CanvasToolbar />
 * </div>
 * ```
 */
export const CanvasToolbar = memo(function CanvasToolbar() {
  useDebugRender("CanvasToolbar");

  return (
    <div className={cn("group/toolbar")}>
      <div className="flex flex-col items-center">
        <Toolbar>
          <div className="flex flex-row items-center space-x-2 rounded-md">
            <CanvasNavigationToggle />
            <ToolbarSeparator />
            <CanvasRearrangeToggle />
            <ToolbarSeparator />

            <CanvasPropertyCodeToggle />
            <CanvasPropertySettingsToggle />
            <CanvasTranslationsToggle />

            <ToolbarSeparator />

            <CanvasDebugToggle />
            <CanvasPreviewToggle />
          </div>
        </Toolbar>
      </div>
    </div>
  );
});
