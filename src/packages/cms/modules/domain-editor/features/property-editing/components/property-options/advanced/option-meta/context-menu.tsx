"use client";

import { EllipsisVertical, FilesIcon, TrashIcon, Trash } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@shared-ui/shadcn/components/ui/dropdown-menu";
import { useCMSTranslations } from "@cms/i18n/use-cms-translation.hooks";
import { usePropertyOptionCRUD } from "@cms/modules/domain-editor/features/property-editing";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";

export const PropertyOptionContextMenu = memo(function PropertyOptionContextMenu({
  propertyId,
  optionId,
}: {
  propertyId: string;
  optionId: string;
}) {
  useDebugRender("PropertyOptionContextMenu");
  const { t } = useCMSTranslations();

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const { clonePropertyOption, deletePropertyOption } = usePropertyOptionCRUD(propertyId);

  const handleClone = useCallback(() => {
    clonePropertyOption(optionId);
  }, [clonePropertyOption, optionId]);

  const handleDelete = useCallback(() => {
    deletePropertyOption(optionId);
  }, [deletePropertyOption, optionId]);

  const deleteConfirmation = (
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
  );

  const dropdownMenu = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hover:text-primary h-4 w-4 p-0 hover:bg-transparent"
          data-testid={`property-option-context-menu-${optionId}`}
        >
          <EllipsisVertical className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-(--radix-dropdown-menu-trigger-width)">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleClone}>
            <FilesIcon size={16} className="opacity-60" aria-hidden="true" />
            {t("common.clone")}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive" onClick={() => setShowDeleteConfirmation(true)}>
            <TrashIcon size={16} aria-hidden="true" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <>
      <div className="absolute top-1/2 -right-1 -translate-y-1/2 opacity-60">{dropdownMenu}</div>
      <AlertDialog open={showDeleteConfirmation} onOpenChange={setShowDeleteConfirmation}>
        {deleteConfirmation}
      </AlertDialog>
    </>
  );
});

PropertyOptionContextMenu.displayName = "PropertyOptionContextMenu";
