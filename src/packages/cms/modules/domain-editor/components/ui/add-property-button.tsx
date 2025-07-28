/**
 * @fileoverview Add Property Button - Property creation trigger component
 *
 * 🎯 PURPOSE: Provides user interface for creating new properties in domain editor
 *
 * 🏗️ ARCHITECTURE DECISIONS:
 * - Standalone button component for property creation
 * - Integrates with canvas store for property addition
 * - Uses new property utility for proper initialization
 * - Positioned at bottom of property list for easy access
 *
 * 🤖 AI GUIDANCE - Add Property Button Usage:
 * ✅ USE at bottom of property lists for new property creation
 * ✅ INTEGRATE with canvas store addProperty action
 * ✅ UTILIZE new property utils for proper initialization
 * ✅ PROVIDE clear visual indication of add functionality
 *
 * ❌ NEVER create properties without proper initialization
 * ❌ NEVER bypass canvas store for property creation
 * ❌ NEVER render without canvas store context
 *
 * 🔄 PROPERTY CREATION FLOW:
 * 1. User clicks button
 * 2. New property utility creates initialized property
 * 3. Canvas store addProperty action adds to state
 * 4. UI updates with new property in list
 *
 * 📚 REFERENCE: See docs/architecture/domain-editor/hook-patterns.md
 */
"use client";

import { Plus } from "lucide-react";
import { Button } from "@shared-ui/shadcn/components/ui/button";
import { useCMSTranslations } from "@cms/i18n/use-cms-translation.hooks";
import { useCanvasStore } from "@cms/modules/domain-editor/stores/canvas-store/canvas.store.hooks";
import { makeFormProperty } from "@cms/modules/domain-editor/utils/new-property.utils";

/**
 * ➕ Add Property Button - Create new properties
 *
 * Button component that handles creation of new properties in the domain editor.
 * Uses the canvas store addProperty action and new property utilities to ensure
 * proper initialization of new properties.
 *
 * Features:
 * - Clear visual design with plus icon
 * - Integrates with canvas store state management
 * - Uses utility functions for consistent property creation
 * - Positioned for easy access at bottom of property lists
 *
 * @example
 * ```tsx
 * // At bottom of property list
 * <PropertyEditorCardList />
 * <AddPropertyButton />
 * ```
 */
export function AddPropertyButton() {
  const store = useCanvasStore();
  const { t } = useCMSTranslations();

  /**
   * 🔧 Handle Property Creation
   *
   * Creates a new property using utility function and adds to canvas store.
   * Ensures consistent initialization and proper state management.
   */
  const handleAddProperty = () => {
    const newProperty = makeFormProperty();
    store.getState().addProperty(newProperty);
  };

  return (
    <Button onClick={handleAddProperty} variant="outline" className="flex items-center gap-2 self-start">
      <Plus className="h-4 w-4" />
      {t("add-property")}
    </Button>
  );
}
