import { XIcon } from "lucide-react";
import { memo, useCallback, useMemo } from "react";
// Compact Option Item Component (Badge-style for simple mode)
import { Badge } from "@shared-ui/shadcn/components/ui/badge";
import { Button } from "@shared-ui/shadcn/components/ui/button";
import { Input } from "@shared-ui/shadcn/components/ui/input";
import { usePropertyOptionCRUD, usePropertyOptionInput } from "@cms/modules/domain-editor/features/property-editing";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";
import { useLayoutStore } from "@cms/modules/domain-editor/stores/layout-store";
import { PropertyOption } from "@cms/modules/properties/property.types";

export const PropertyOptionCompactItem = memo(function PropertyOptionCompactItem({
  propertyId,
  optionId,
}: {
  propertyId: string;
  optionId: string;
}) {
  useDebugRender("PropertyOptionCompactItem");

  const { deletePropertyOption } = usePropertyOptionCRUD(propertyId);

  const handleDelete = useCallback(() => {
    deletePropertyOption(optionId);
  }, [deletePropertyOption, optionId]);

  const { updateOptionName } = usePropertyOptionCRUD(propertyId);
  const layoutStore = useLayoutStore();
  const currentTranslation = layoutStore((state) => state.currentTranslation);

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

  const input = useMemo(
    () => (
      <Input
        type="text"
        ref={inputRef}
        defaultValue={defaultValue}
        onChange={onChange}
        className="h-6 border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0 dark:bg-transparent"
        data-testid={`property-option-compact-input-${optionId}`}
      />
    ),
    [inputRef, defaultValue, onChange, optionId],
  );

  const deleteButton = useMemo(
    () => (
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDelete}
        className="h-4 w-4 p-0 hover:bg-transparent hover:text-red-500"
        data-testid={`property-option-compact-delete-${optionId}`}
      >
        <XIcon className="h-3 w-3" />
      </Button>
    ),
    [handleDelete, optionId],
  );

  const badge = useMemo(
    () => (
      <Badge
        variant="outline"
        className="h-auto gap-1 px-2 py-1 text-sm"
        data-testid={`property-option-compact-item-${optionId}`}
      >
        {input}
        {deleteButton}
      </Badge>
    ),
    [input, deleteButton, optionId],
  );

  return (
    <div className="relative" key={optionId}>
      {badge}
    </div>
  );
});

PropertyOptionCompactItem.displayName = "PropertyOptionCompactItem";
