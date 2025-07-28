import { IconGripVertical, IconSortAscendingLetters } from "@tabler/icons-react";
import { memo, useCallback } from "react";
import { QuickTooltip } from "@shared-ui/components/ui/quick-tooltip";
import { ToggleGroup, ToggleGroupItem } from "@shared-ui/shadcn/components/ui/toggle-group";
import { useCMSTranslations } from "@cms/i18n/use-cms-translation.hooks";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";
import { useReactiveValue } from "@cms/modules/domain-editor/hooks/use-property";
import { FormProperty } from "@cms/modules/properties/form/types";
import { PropertyMetaOption } from "@cms/modules/properties/property.types";

// Sorting Toggle (Manual vs Alphabetical)
export const PropertyOptionSortingToggle = memo(function PropertyOptionSortingToggle() {
  useDebugRender("PropertyOptionSortingToggle");
  const { t } = useCMSTranslations();
  const getSortingValue = useCallback((property: FormProperty) => {
    if (property.meta?.type === "option") {
      return property.meta.sorting || "alphabet";
    }
    return "alphabet";
  }, []);

  const setSortingValue = useCallback((draft: FormProperty, value: string) => {
    if (!draft.meta) draft.meta = { type: "option", multi: true, sorting: "alphabet" };
    (draft.meta as PropertyMetaOption).sorting = value as "manual" | "alphabet";
  }, []);

  const { value: currentValue, setValue: setCurrentValue } = useReactiveValue<string>({
    getValue: getSortingValue,
    setValue: setSortingValue,
  });

  const handleValueChange = useCallback(
    (value: string) => {
      if (value) {
        setCurrentValue(value);
      }
    },
    [setCurrentValue],
  );

  const displayValue = currentValue || "alphabet";
  const toggleStyle = "flex h-8 min-w-12 items-center justify-center font-bold tracking-wider text-muted-foreground";

  return (
    <div className="flex w-full items-center justify-center px-1 pb-0">
      <ToggleGroup
        type="single"
        value={displayValue}
        onValueChange={handleValueChange}
        className="bg-background border-input rounded-md border"
        data-testid="option-sorting-toggle"
      >
        <QuickTooltip content={t("property.option.manual-sorting")}>
          <div>
            <ToggleGroupItem value="manual" className={toggleStyle}>
              <IconGripVertical />
            </ToggleGroupItem>
          </div>
        </QuickTooltip>
        <QuickTooltip content={t("property.option.alphabetical-sorting")}>
          <div>
            <ToggleGroupItem value="alphabet" className={toggleStyle}>
              <IconSortAscendingLetters />
            </ToggleGroupItem>
          </div>
        </QuickTooltip>
      </ToggleGroup>
    </div>
  );
});
