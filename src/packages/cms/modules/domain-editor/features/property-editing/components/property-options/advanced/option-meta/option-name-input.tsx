import { memo, useCallback, useMemo } from "react";
import { Input } from "@shared-ui/shadcn/components/ui/input";
import { useCMSTranslations } from "@cms/i18n/use-cms-translation.hooks";
import { usePropertyOptionCRUD, usePropertyOptionInput } from "@cms/modules/domain-editor/features/property-editing";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";
import { useCanvasStore } from "@cms/modules/domain-editor/stores/canvas-store";
import { useLayoutStore } from "@cms/modules/domain-editor/stores/layout-store";
import { PropertyOption } from "@cms/modules/properties/property.types";

export const PropertyOptionNameInput = memo(function PropertyOptionNameInput({
  propertyId,
  optionId,
}: {
  propertyId: string;
  optionId: string;
}) {
  useDebugRender("PropertyOptionNameInput");

  const { t } = useCMSTranslations();
  const layoutStore = useLayoutStore();
  const canvasStore = useCanvasStore();
  const { updateOptionName } = usePropertyOptionCRUD(propertyId);

  const currentTranslation = layoutStore((state) => state.currentTranslation) || "";
  const currentLocale = layoutStore((state) => state.currentLocale);

  const getValue = useCallback(
    (option: PropertyOption | undefined) => option?.name?.[currentTranslation] || "",
    [currentTranslation],
  );

  const setValue = useCallback(
    (optionId: string, locale: string, value: string) => {
      updateOptionName(optionId, locale, value);
    },
    [updateOptionName],
  );

  const { inputRef, defaultValue, onChange } = usePropertyOptionInput({
    propertyId,
    optionId,
    getValue,
    setValue,
    locale: currentTranslation,
  });

  // Optimized: only get main name if needed, avoid expensive subscription when not needed
  const mainName = canvasStore(
    useCallback(
      (state) => {
        if (currentTranslation === currentLocale) {
          return null;
        }
        const option = state.propertyOptions[propertyId]?.[optionId];
        return option?.name?.[currentLocale] || "";
      },
      [currentTranslation, currentLocale, propertyId, optionId],
    ),
  );

  const placeholder = useMemo(() => {
    if (mainName) {
      return `${t("property.option.name")} / ${mainName}`;
    } else {
      return t("property.option.name");
    }
  }, [mainName, t]);

  return (
    <div className="relative flex w-full" key={currentTranslation}>
      <Input
        type="text"
        ref={inputRef}
        defaultValue={defaultValue}
        onChange={onChange}
        placeholder={placeholder}
        className="h-8 bg-transparent py-0 pl-0 shadow-none dark:bg-transparent"
        data-testid={`property-option-name-input-${optionId}`}
      />
    </div>
  );
});

PropertyOptionNameInput.displayName = "PropertyOptionNameInput";
