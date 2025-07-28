/**
 * @fileoverview Property Option Badge Item with Confirmation
 *
 * 🎯 PURPOSE: Enhanced badge-style option component with delete confirmation
 *
 * 🏗️ ARCHITECTURE DECISIONS:
 * - Based on existing PropertyOptionCompactItem component
 * - Adds delete confirmation dialog support
 * - Maintains all existing badge functionality and styling
 * - Uses same patterns as context-menu.tsx for confirmation
 * - Dynamic badge width with max-width constraints for long text
 *
 * 🎨 UX IMPROVEMENTS (Phase 1.1):
 * - Dynamic width: w-fit for content-based sizing
 * - Max-width constraint: max-w-[200px] for very long option names
 * - Text overflow: truncate with ellipsis for readability
 * - Proper spacing: consistent padding and gap
 *
 * 🤖 AI GUIDANCE - Badge Item with Confirmation Usage:
 * ✅ USE for badge-style options requiring delete confirmation
 * ✅ EXTENDS existing PropertyOptionCompactItem functionality
 * ✅ CONSISTENT confirmation dialog with existing patterns
 * ✅ MAINTAINS badge visual design and behavior
 * ✅ DYNAMIC sizing with overflow handling
 *
 * ❌ NEVER bypass confirmation for destructive operations
 * ❌ NEVER duplicate existing PropertyOptionCompactItem logic
 * ❌ NEVER change established badge styling patterns
 * ❌ NEVER allow badges to grow beyond max-width
 *
 * 🔄 ENHANCED FLOW:
 * 1. User edits option name in badge input field (with overflow handling)
 * 2. User clicks delete (X) button
 * 3. Confirmation dialog appears with Trash icon
 * 4. User confirms or cancels deletion
 * 5. If confirmed, option is deleted via usePropertyOptionCRUD
 *
 * 📚 REFERENCE: Based on PropertyOptionCompactItem + context-menu.tsx patterns
 */
"use client";

import { XIcon, Trash } from "lucide-react";
import { memo, useCallback, useMemo, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@shared-ui/shadcn/components/ui/alert-dialog";
import { Badge } from "@shared-ui/shadcn/components/ui/badge";
import { Button } from "@shared-ui/shadcn/components/ui/button";
import { Input } from "@shared-ui/shadcn/components/ui/input";
import { useCMSTranslations } from "@cms/i18n/use-cms-translation.hooks";
import { usePropertyOptionCRUD, usePropertyOptionInput } from "@cms/modules/domain-editor/features/property-editing";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";
import { useCanvasStore } from "@cms/modules/domain-editor/stores/canvas-store";
import { useLayoutStore } from "@cms/modules/domain-editor/stores/layout-store";
import { getAvailableLocalizedText } from "@cms/modules/localization/utils/get-available-localized-text";
import { PropertyOption } from "@cms/modules/properties/property.types";
/**
 * 🏷️ Property Option Badge Item with Confirmation
 *
 * Enhanced badge-style component for property options that includes delete confirmation.
 * Based on existing PropertyOptionCompactItem with added confirmation dialog and improved UX.
 *
 * Features:
 * - Dynamic badge width with max-width constraints (max-w-[200px])
 * - Text overflow handling with ellipsis for long option names
 * - Inline text input for option name editing
 * - Delete button with confirmation dialog
 * - Consistent styling with existing badge patterns
 * - Integration with usePropertyOptionCRUD and usePropertyOptionInput hooks
 * - Content-based sizing for optimal space usage
 *
 * @param propertyId - ID of the property containing the option
 * @param optionId - ID of the option to display and manage
 *
 * @example
 * ```tsx
 * <PropertyOptionBadgeItemWithConfirmation
 *   propertyId="prop-123"
 *   optionId="opt-456"
 * />
 * ```
 */
export const PropertyOptionBadgeItemWithConfirmation = memo(function PropertyOptionBadgeItemWithConfirmation({
  propertyId,
  optionId,
}: {
  propertyId: string;
  optionId: string;
}) {
  useDebugRender("PropertyOptionBadgeItemWithConfirmation");
  const { t } = useCMSTranslations();

  // 🗑️ Delete confirmation state
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const { deletePropertyOption } = usePropertyOptionCRUD(propertyId);

  // 📝 Option input management (reusing existing pattern)
  const { updateOptionName } = usePropertyOptionCRUD(propertyId);
  const layoutStore = useLayoutStore();
  const currentTranslation = layoutStore((state) => state.currentTranslation);
  const currentLocale = layoutStore((state) => state.currentLocale);
  const canvasStore = useCanvasStore();

  const placeholder =
    canvasStore(
      useCallback(
        (state) => {
          if (currentTranslation === currentLocale) {
            return null;
          }
          const option = state.propertyOptions[propertyId]?.[optionId];
          return getAvailableLocalizedText(option?.name, currentTranslation || currentLocale);
        },
        [currentTranslation, currentLocale, propertyId, optionId],
      ),
    ) || "";

  const getValue = useCallback(
    (option: PropertyOption | undefined, locale?: string) => {
      const targetLocale = locale || currentTranslation;
      return option?.name?.[targetLocale] || "";
    },
    [currentTranslation],
  );

  const setValue = useCallback(
    (optionId: string, locale: string, value: string) => {
      updateOptionName(optionId, currentTranslation, value.trim());
    },
    [updateOptionName, currentTranslation],
  );

  const { inputRef, defaultValue, onChange } = usePropertyOptionInput({
    propertyId,
    optionId,
    getValue,
    setValue,
    locale: "",
  });

  // 🎯 Delete handlers
  const handleDelete = useCallback(() => {
    deletePropertyOption(optionId);
    setShowDeleteConfirmation(false);
  }, [deletePropertyOption, optionId]);

  const triggerDelete = useCallback(() => {
    setShowDeleteConfirmation(true);
  }, []);

  // 🎨 Memoized components for performance with improved sizing
  const optionInput = useMemo(
    () => (
      <Input
        type="text"
        ref={inputRef}
        value={defaultValue}
        onChange={onChange}
        placeholder={placeholder}
        className="h-6 min-w-0 flex-1 truncate border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0 dark:bg-transparent"
        data-testid={`property-option-badge-input-${optionId}`}
      />
    ),
    [inputRef, defaultValue, onChange, optionId],
  );

  const deleteButton = useMemo(
    () => (
      <Button
        variant="ghost"
        size="icon"
        onClick={triggerDelete}
        className="h-4 w-4 shrink-0 p-0 hover:bg-transparent hover:text-red-500"
        data-testid={`property-option-badge-delete-${optionId}`}
      >
        <XIcon className="h-3 w-3" />
      </Button>
    ),
    [triggerDelete, optionId],
  );

  const optionBadge = useMemo(
    () => (
      <Badge
        variant="outline"
        className="flex h-auto w-fit max-w-[200px] items-center gap-1 px-2 py-1 text-sm"
        data-testid={`property-option-badge-item-${optionId}`}
      >
        {optionInput}
        {deleteButton}
      </Badge>
    ),
    [optionInput, deleteButton, optionId],
  );

  // 🗑️ Delete confirmation dialog (extracted from context-menu.tsx pattern)
  const deleteConfirmationDialog = (
    <AlertDialog open={showDeleteConfirmation} onOpenChange={setShowDeleteConfirmation}>
      <AlertDialogContent>
        <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full border" aria-hidden="true">
            <Trash className="opacity-80" size={16} />
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("property_options.manage_dialog.delete_confirmation.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("property_options.manage_dialog.delete_confirmation.description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
          <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={handleDelete}>
            {t("common.delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return (
    <div className="relative" key={optionId}>
      {optionBadge}
      {deleteConfirmationDialog}
    </div>
  );
});

PropertyOptionBadgeItemWithConfirmation.displayName = "PropertyOptionBadgeItemWithConfirmation";
