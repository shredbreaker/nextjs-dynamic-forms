"use client";

import { useEffect } from "react";
import { cn } from "@shared-ui/lib/utils";
import { AddPropertyButton } from "@cms/modules/domain-editor/components/ui";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";
import { PropertyEditorCardList } from "./property-editor-list";
// import CanvasDebugCard from "../../components/canvas-debug-card";

/**
 * @fileoverview Canvas Component - Main property editing canvas
 *
 * 🎯 PURPOSE: Primary workspace for property editing and management
 *
 * 🏗️ ARCHITECTURE DECISIONS:
 * - Central hub for property editing workflows
 * - Integrates toolbar, property list, and editing components
 * - Handles canvas store hydration for property data
 * - Responsive layout with conditional rendering
 *
 * 🤖 AI GUIDANCE - Canvas Component Usage:
 * ✅ USE as main editing workspace in domain layout
 * ✅ HANDLE hydration state for property data loading
 * ✅ INTEGRATE with canvas store for property operations
 * ✅ COMPOSE toolbar and property list components
 *
 * ❌ NEVER render without canvas store context
 * ❌ NEVER skip hydration fallbacks
 * ❌ NEVER manage property data locally (use canvas store)
 *
 * 🔄 HYDRATION HANDLING:
 * - Shows loading fallback during hydration
 * - Prevents hydration mismatches with property data
 * - Ensures smooth user experience during initial load
 *
 * 📚 REFERENCE: See docs/architecture/domain-editor/hook-patterns.md
 */

/**
 * 🎨 PropertyCanvas - Main property editing workspace
 *
 * Primary component for property editing that provides the main workspace interface.
 * Handles URL hash navigation for direct property linking and composes the property
 * list with add property functionality.
 *
 * Features:
 * - URL hash navigation to specific properties
 * - Property list rendering and management
 * - Add property button for creating new properties
 * - Automatic focus and scroll behavior for property links
 *
 * @example
 * ```tsx
 * // URL: /domain-editor/123#property-abc123
 * // Will auto-focus and scroll to property with ID "abc123"
 * <PropertyCanvas />
 * ```
 */
export default function PropertyCanvas() {
  useDebugRender("PropertyCanvas");
  /**
   * 🔗 URL Hash Navigation Effect
   *
   * Handles navigation to specific properties via URL hash.
   * Automatically focuses input and scrolls to property when hash changes.
   */
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const element = document.querySelector(hash);
        if (element) {
          const input = element.querySelector("input");
          input?.focus();
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    };

    // Handle initial hash on mount
    handleHashChange();

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <div className="bg-muted flex h-full w-full flex-col items-start justify-between space-y-2 pb-4">
      <div className="flex flex-1 flex-col justify-start space-y-0 overflow-y-auto px-6">
        <PropertyEditorCardList />
      </div>
      <div className={cn("flex w-full items-center justify-center")}>
        <AddPropertyButton />
      </div>
    </div>
  );
}
