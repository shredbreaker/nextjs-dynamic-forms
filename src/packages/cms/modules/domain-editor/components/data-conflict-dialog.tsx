/**
 * @fileoverview Data Conflict Dialog - Handles conflicts when DB data changes
 *
 * 🎯 PURPOSE: Shows conflict resolution dialog when DB properties change while editing
 *
 * 🏗️ ARCHITECTURE DECISIONS:
 * - Uses AlertDialog for modal behavior
 * - Connects to canvas store for conflict state
 * - Provides clear refresh/cancel options
 * - Prevents data loss with explicit user choice
 *
 * 🤖 AI GUIDANCE - Dialog Usage:
 * ✅ USE in domain layout as global dialog
 * ✅ CONNECT to canvas store conflict state
 * ✅ PROVIDE clear conflict resolution options
 * ✅ PREVENT accidental data loss
 *
 * ❌ NEVER auto-resolve conflicts without user input
 * ❌ NEVER show dialog when no conflict exists
 *
 * 🔄 CONFLICT RESOLUTION FLOW:
 * 1. Detect DB data changed while editing
 * 2. Show dialog with refresh/cancel options
 * 3. User chooses to refresh (lose changes) or cancel (keep working)
 * 4. Clear conflict state and proceed
 *
 * 📚 REFERENCE: Follows same pattern as other confirmation dialogs
 */
"use client";

import { memo } from "react";
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
import { useCanvasStore } from "@cms/modules/domain-editor/stores/canvas-store/canvas.store.hooks";

/**
 * 🔍 Data Conflict Dialog - Resolve data conflicts
 *
 * Shows when DB properties have changed while user was editing.
 * Provides options to refresh with new data (losing changes) or
 * continue working with current data.
 *
 * Features:
 * - Clear conflict explanation
 * - Refresh button (green) to accept new data
 * - Cancel button to keep working
 * - Connects to canvas store conflict state
 */
function DataConflictDialogComponent() {
  const canvasStore = useCanvasStore();

  const hasConflict = canvasStore((state) => state.hasDataConflict);
  const resolveConflict = canvasStore((state) => state.resolveConflict);

  const handleRefresh = () => {
    resolveConflict("refresh");
  };

  const handleCancel = () => {
    resolveConflict("cancel");
  };

  if (hasConflict) {
    console.log("🚨 DataConflictDialog - SHOWING DIALOG");
  }

  return (
    <AlertDialog open={hasConflict}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Data Outdated</AlertDialogTitle>
          <AlertDialogDescription>
            The data has been updated by someone else while you were editing. Would you like to discard your changes and
            refresh with the latest data?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleRefresh} className="bg-green-600 hover:bg-green-700">
            Refresh
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export const DataConflictDialog = memo(DataConflictDialogComponent);
