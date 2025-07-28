/**
 * @fileoverview Reset Button - Canvas state reset component
 *
 * 🎯 PURPOSE: Provides user interface for resetting domain editor canvas state
 *
 * 🏗️ ARCHITECTURE DECISIONS:
 * - Standalone button component for canvas reset operations
 * - Integrates with canvas store reset functionality
 * - Uses confirmation dialog for destructive action
 * - Positioned in navigation/toolbar areas for easy access
 *
 * 🤖 AI GUIDANCE - Reset Button Usage:
 * ✅ USE in navigation/toolbar for canvas state reset
 * ✅ INTEGRATE with canvas store reset actions
 * ✅ PROVIDE confirmation before destructive operations
 * ✅ SHOW clear visual indication of reset functionality
 *
 * ❌ NEVER reset without user confirmation
 * ❌ NEVER bypass canvas store for state management
 * ❌ NEVER render without canvas store context
 *
 * 🔄 RESET FLOW:
 * 1. User clicks reset button
 * 2. Confirmation dialog appears (optional)
 * 3. Canvas store reset action clears state
 * 4. UI updates with empty/default state
 *
 * 📚 REFERENCE: See docs/architecture/domain-editor/hook-patterns.md
 */
"use client";

import { RotateCcw, Trash } from "lucide-react";
import { memo, useCallback, useState } from "react";
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
import { Button } from "@shared-ui/shadcn/components/ui/button";
import { useCMSTranslations } from "@cms/i18n/use-cms-translation.hooks";
import { useCanvasStore } from "@cms/modules/domain-editor/stores/canvas-store/canvas.store.hooks";

/**
 * 🔄 Reset Button - Reset canvas state
 *
 * Button component that handles resetting the domain editor canvas state.
 * Provides a clear way to reset all properties and return to initial state.
 *
 * Features:
 * - Clear visual design with rotate icon
 * - Integrates with canvas store state management
 * - Provides immediate reset functionality
 * - Positioned for easy access in navigation areas
 * - Confirmation dialog for destructive operations
 *
 * @example
 * ```tsx
 * // In navigation toolbar
 * <div className="flex items-center space-x-3">
 *   <DomainNameInput />
 *   <ResetButton />
 * </div>
 * ```
 */
function CanvasResetButton() {
  const store = useCanvasStore();
  const { t } = useCMSTranslations();
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);

  /**
   * 🔧 Handle Canvas Reset
   *
   * Resets the canvas store to initial state, clearing all properties
   * and returning to default domain editor state.
   */
  const handleReset = useCallback(() => {
    store.getState().reset();
    setShowResetConfirmation(false);
  }, [store]);

  const triggerReset = useCallback(() => {
    setShowResetConfirmation(true);
  }, []);

  return (
    <>
      <Button
        onClick={triggerReset}
        variant="ghost"
        size="default"
        className="bg-muted flex items-center gap-2 opacity-20 hover:opacity-100"
      >
        <RotateCcw className="h-4 w-4" />
      </Button>

      <AlertDialog open={showResetConfirmation} onOpenChange={setShowResetConfirmation}>
        <AlertDialogContent>
          <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full border" aria-hidden="true">
              <Trash className="opacity-80" size={16} />
            </div>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("canvas.reset.title")}</AlertDialogTitle>
              <AlertDialogDescription>{t("canvas.reset.description")}</AlertDialogDescription>
            </AlertDialogHeader>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={handleReset}>
              {t("common.reset")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export const ResetButton = memo(CanvasResetButton);
