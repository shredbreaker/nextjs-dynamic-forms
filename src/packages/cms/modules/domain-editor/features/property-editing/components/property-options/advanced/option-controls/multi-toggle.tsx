import { IconSquareCheck, IconCopyCheck } from "@tabler/icons-react";
import { memo, useCallback } from "react";
import { QuickTooltip } from "@shared-ui/components/ui/quick-tooltip";
import { ToggleGroup, ToggleGroupItem } from "@shared-ui/shadcn/components/ui/toggle-group";
import { useCMSTranslations } from "@cms/i18n/use-cms-translation.hooks";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";
import { useReactiveValue } from "@cms/modules/domain-editor/hooks/use-property";
import { FormProperty } from "@cms/modules/properties/form/types";
import { PropertyMetaOption } from "@cms/modules/properties/property.types";

// Multi/Single Selection Toggle
export const PropertyOptionMultiToggle = memo(function PropertyOptionMultiToggle() {
  useDebugRender("PropertyOptionMultiToggle");
  const { t } = useCMSTranslations();
  const getMultiValue = useCallback((property: FormProperty) => {
    if (property.meta?.type === "option") {
      return property.meta.multi === false ? "single" : "multi";
    }
    return "multi";
  }, []);

  const setMultiValue = useCallback((draft: FormProperty, value: string) => {
    if (!draft.meta) draft.meta = { type: "option", multi: true, sorting: "alphabet" };
    (draft.meta as PropertyMetaOption).multi = value === "multi";
  }, []);

  const { value: currentValue, setValue: setCurrentValue } = useReactiveValue<string>({
    getValue: getMultiValue,
    setValue: setMultiValue,
  });

  const handleValueChange = useCallback(
    (value: string) => {
      if (value) {
        setCurrentValue(value);
      }
    },
    [setCurrentValue],
  );

  const displayValue = currentValue || "multi";
  const toggleStyle = "flex h-8 min-w-12 items-center justify-center font-bold tracking-wider text-muted-foreground";

  return (
    <div className="flex w-full items-center justify-center px-1 pb-0">
      <ToggleGroup
        type="single"
        value={displayValue}
        onValueChange={handleValueChange}
        className="bg-background border-input rounded-md border"
        data-testid="option-multi-toggle"
      >
        <QuickTooltip content={t("property.option.single-selection")}>
          <div>
            <ToggleGroupItem value="single" className={toggleStyle}>
              <IconSquareCheck />
            </ToggleGroupItem>
          </div>
        </QuickTooltip>
        <QuickTooltip content={t("property.option.multi-selection")}>
          <div>
            <ToggleGroupItem value="multi" className={toggleStyle}>
              <IconCopyCheck />
            </ToggleGroupItem>
          </div>
        </QuickTooltip>
      </ToggleGroup>
    </div>
  );
});
