"use client";

import { EllipsisVertical, FilesIcon, GripVertical, TrashIcon, Trash } from "lucide-react";
import { memo, useCallback, useState, useDeferredValue, useMemo } from "react";
import { cn } from "@shared-ui/lib/utils";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@shared-ui/shadcn/components/ui/dropdown-menu";
import { useCMSTranslations } from "@cms/i18n/use-cms-translation.hooks";
import { useDragHandleProps, usePropertyContext } from "@cms/modules/domain-editor/contexts";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";
import { usePropertyDisplay } from "@cms/modules/domain-editor/hooks/use-property";
import { useCanvasStore } from "@cms/modules/domain-editor/stores/canvas-store/canvas.store.hooks";
import { useLayoutStore } from "@cms/modules/domain-editor/stores/layout-store/layout.store.hooks";
import {
  PropertyCodeInput,
  PropertyNameInput,
  PropertyTypeSelector,
  PropertyLockToggleButton,
  PropertyPrivateToggleButton,
  PropertyRequiredToggleButton,
} from "@cms/modules/properties/form/fields/components";
import { useProperty } from "@cms/modules/properties/form/hooks";
import { FormProperty } from "@cms/modules/properties/form/types";
import { PropertyAdvanced } from "./components/property-advanced";
import { PropertyOptionCompactList } from "./property-options";
export const PropertyEditorCard = memo(function PropertyEditorCard() {
  useDebugRender("PropertyEditorCard");
  const { t } = useCMSTranslations();
  const layoutStore = useLayoutStore();
  const showPropertyCode = layoutStore((state) => state.showPropertyCode);
  const showAdvancedSettings = layoutStore((state) => state.showAdvancedSettings);

  // Defer heavy advanced settings rendering to improve performance
  const deferredShowAdvancedSettings = useDeferredValue(showAdvancedSettings);

  const { propertyId } = usePropertyContext();
  const canvasStore = useCanvasStore();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const dragHandleProps = useDragHandleProps();

  // 🎯 Get current property type for conditional compact mode rendering
  const propertyType = usePropertyDisplay({
    getValue: (property: FormProperty) => property.type || "text",
  });

  const handleDelete = useCallback(() => {
    canvasStore.getState().deleteProperty(propertyId);
  }, [canvasStore, propertyId]);

  const handleClone = useCallback(() => {
    canvasStore.getState().cloneProperty(propertyId);
  }, [canvasStore, propertyId]);

  const isLocked = useProperty((property) => property.is_locked);

  const isRearrangeActive = layoutStore((state) => state.rearrangeToggleActive);

  const deleteConfirmation = useMemo(
    () => (
      <AlertDialogContent>
        <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full border" aria-hidden="true">
            <Trash className="opacity-80" size={16} />
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("common.delete")} {t("property.name.label").toLowerCase()}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("property_options.manage_dialog.delete_confirmation.description").replace("option", "field")}
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
    ),
    [handleDelete, t],
  );

  const dropdownMenu = useMemo(
    () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="hover:text-primary hover:bg-transparent">
            <EllipsisVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-(--radix-dropdown-menu-trigger-width)">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={handleClone}>
              <FilesIcon size={16} className="opacity-60" aria-hidden="true" />
              {t("common.clone")}
            </DropdownMenuItem>
          </DropdownMenuGroup>

          {!isLocked && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem variant="destructive" onClick={() => setShowDeleteConfirmation(true)}>
                  <TrashIcon size={16} aria-hidden="true" />
                  {t("common.delete")}
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    [handleClone, isLocked, t],
  );

  return (
    <div
      {...(isRearrangeActive ? dragHandleProps : {})}
      className={cn("w-full", isRearrangeActive && "cursor-grabbing")}
    >
      <div
        // {...dragHandleProps}
        className={cn(
          "group bg-background relative flex flex-col items-start justify-center space-y-0 rounded-md border-1 shadow-lg select-none",
          "focus-within:ring-primary focus-within:ring-2 focus-within:ring-offset-2",
          isRearrangeActive && "animate-[shake_0.3s_infinite]",
          isRearrangeActive && "pointer-events-none",
        )}
      >
        {/* Property code */}
        {showPropertyCode && (
          <div className="flex w-full flex-row justify-between border-b-1">
            <PropertyCodeInput />
          </div>
        )}

        {/* Basic information */}
        <div
          className={`relative flex w-full flex-row items-center justify-between space-x-2 p-2 ${showPropertyCode ? "rounded-t-none" : ""}`}
        >
          <PropertyTypeSelector />
          <div className="flex w-full flex-col items-start justify-center space-y-0 pe-4" id={`property-${propertyId}`}>
            <PropertyNameInput />
          </div>

          {/* Menu */}
          <div className="absolute top-1/2 -right-3 -translate-y-1/2 opacity-60">{dropdownMenu}</div>

          <div
            {...dragHandleProps}
            className={cn(
              "text-muted-foreground absolute top-1/2 -left-7 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center opacity-0 select-none group-hover:opacity-100",
              deferredShowAdvancedSettings ? "opacity-100" : "opacity-0",
              isRearrangeActive && "text-primary opacity-100",
            )}
          >
            <GripVertical className={cn("h-4 w-4 opacity-60")} />
          </div>
        </div>

        {/* 🏷️ COMPACT MODE: Badge interface for option properties when advanced settings is OFF */}
        {!deferredShowAdvancedSettings && propertyType === "option" && (
          <div className="mb-2 flex w-full flex-col items-center justify-center transition-all duration-200 ease-out">
            <PropertyOptionCompactList />
          </div>
        )}

        {/* 🔧 ADVANCED MODE: Full property settings when advanced settings is ON */}
        {deferredShowAdvancedSettings && (
          <div className="mb-2 flex w-full flex-col items-center justify-center transition-all duration-200 ease-out">
            <PropertyAdvanced />
          </div>
        )}

        <div className="absolute top-0 -right-8 flex w-8 cursor-pointer flex-col items-center justify-start space-y-1 select-none">
          {showPropertyCode && <PropertyLockToggleButton alwaysVisible={deferredShowAdvancedSettings} />}
          <PropertyRequiredToggleButton alwaysVisible={deferredShowAdvancedSettings} />
          <PropertyPrivateToggleButton alwaysVisible={deferredShowAdvancedSettings} />
        </div>

        {/* Delete confirmation */}
        <AlertDialog open={showDeleteConfirmation} onOpenChange={setShowDeleteConfirmation}>
          {deleteConfirmation}
        </AlertDialog>
      </div>
    </div>
  );
});
