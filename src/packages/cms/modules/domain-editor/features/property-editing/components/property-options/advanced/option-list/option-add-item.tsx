import { useCallback, useContext, memo } from "react";
import { useCMSTranslations } from "@cms/i18n/use-cms-translation.hooks";
import { PropertyRowContext } from "@cms/modules/domain-editor/contexts";
import { usePropertyOptionCRUD } from "@cms/modules/domain-editor/features/property-editing";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";

export const PropertyOptionAddItem = memo(function PropertyOptionAddItem() {
  useDebugRender("PropertyOptionAddItem");
  const { t } = useCMSTranslations();
  const { propertyId } = useContext(PropertyRowContext)!;
  const { addPropertyOption } = usePropertyOptionCRUD(propertyId);

  const handleAddOption = useCallback(() => {
    addPropertyOption();
  }, [addPropertyOption]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleAddOption();
      }
    },
    [handleAddOption],
  );

  return (
    <div
      onClick={handleAddOption}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={t("property_options.manage_dialog.add_new_section")}
      className="bg-muted/30 border-muted hover:bg-muted/50 focus:bg-muted/50 focus:ring-ring flex w-full cursor-pointer items-center rounded-md border-2 border-dashed p-2 transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
      data-testid="property-option-add-item"
    >
      <span className="text-muted-foreground mr-2 flex h-4 w-4 items-center justify-center">+</span>
      <span className="text-muted-foreground flex-1 text-sm">
        {t("property_options.manage_dialog.add_new_section")}
      </span>
    </div>
  );
});
