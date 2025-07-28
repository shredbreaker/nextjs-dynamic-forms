import { memo, useCallback, useContext } from "react";
import { QuickTooltip } from "@shared-ui/components/ui/quick-tooltip";
import { FloatingInput, FloatingLabel } from "@shared-ui/shadcn/components/ui/floating-label-input";
import { ToggleGroup, ToggleGroupItem } from "@shared-ui/shadcn/components/ui/toggle-group";
import { useCMSTranslations } from "@cms/i18n/use-cms-translation.hooks";
import { PropertyRowContext } from "@cms/modules/domain-editor/contexts";
import { useUncontrolledInput, useReactiveValue } from "@cms/modules/domain-editor/hooks/use-property";
import { FormProperty } from "@cms/modules/properties/form/types";
import { PropertyMetaNumber } from "@cms/modules/properties/property.types";

export const PropertyNumberSettings = memo(function PropertyNumberSettings() {
  return (
    <div className="flex w-full flex-row items-center justify-between space-x-1">
      <div className="flex w-2/3 items-center px-1">
        <PropertyNumberMinMaxSettings />
      </div>
      <div className="flex w-1/3 items-center px-1">
        <PropertyNumberFormatSettings />
      </div>
    </div>
  );
});

export const PropertyNumberFormatSettings = memo(function PropertyNumberFormatSettings() {
  const getDecimalValue = useCallback((property: FormProperty) => {
    if (property.meta?.type === "number") {
      return property.meta.integer === true ? "integer" : "float";
    }
    return "integer";
  }, []);

  const setDecimalValue = useCallback((draft: FormProperty, value: string) => {
    if (!draft.meta) draft.meta = { type: "number" };
    (draft.meta as PropertyMetaNumber).integer = value === "integer";
  }, []);

  const { value: currentValue, setValue: setCurrentValue } = useReactiveValue<string>({
    getValue: getDecimalValue,
    setValue: setDecimalValue,
  });

  const handleValueChange = useCallback(
    (value: string) => {
      if (value) {
        setCurrentValue(value);
      }
    },
    [setCurrentValue],
  );

  const { t } = useCMSTranslations();

  const displayValue = currentValue || "integer";
  const toggleStyle = "flex h-8 min-w-12 items-center justify-center font-bold tracking-wider text-muted-foreground";

  return (
    <div className="flex w-full items-center justify-center px-1 pb-0">
      <ToggleGroup
        type="single"
        value={displayValue}
        onValueChange={handleValueChange}
        className="bg-background border-input rounded-md border"
      >
        <QuickTooltip content={t("property.number.tooltip.integer")}>
          <div>
            <ToggleGroupItem value="integer" className={toggleStyle}>
              0
            </ToggleGroupItem>
          </div>
        </QuickTooltip>
        <QuickTooltip content={t("property.number.tooltip.decimal")}>
          <div>
            <ToggleGroupItem value="float" className={toggleStyle}>
              0.0
            </ToggleGroupItem>
          </div>
        </QuickTooltip>
      </ToggleGroup>
    </div>
  );
});

export const PropertyNumberMinMaxSettings = memo(function PropertyNumberMinMaxSettings() {
  const { propertyId } = useContext(PropertyRowContext)!;

  const getMinValue = useCallback(
    (property: FormProperty) => (property.meta?.type === "number" ? property.meta.min?.toString() : "") || "",
    [],
  );
  const setMinValue = useCallback((draft: FormProperty, value: string) => {
    if (!draft.meta) draft.meta = { type: "number" };
    (draft.meta as PropertyMetaNumber).min = Number(value);
  }, []);

  const { t } = useCMSTranslations();
  const {
    inputRef: inputRefMin,
    defaultValue: defaultValueMin,
    onChange: onChangeMin,
  } = useUncontrolledInput({
    getValue: getMinValue,
    setValue: setMinValue,
  });

  const getMaxValue = useCallback(
    (property: FormProperty) => (property.meta?.type === "number" ? property.meta.max?.toString() : "") || "",
    [],
  );
  const setMaxValue = useCallback((draft: FormProperty, value: string) => {
    if (!draft.meta) draft.meta = { type: "number" };
    (draft.meta as PropertyMetaNumber).max = Number(value);
  }, []);

  const {
    inputRef: inputRefMax,
    defaultValue: defaultValueMax,
    onChange: onChangeMax,
  } = useUncontrolledInput({
    getValue: getMaxValue,
    setValue: setMaxValue,
  });

  const inputIdMin = `property-number-input-${propertyId}-min`;
  const inputIdMax = `property-number-input-${propertyId}-max`;

  const containerStyle = "flex h-14 flex-col items-start justify-center space-y-0";
  const inputStyle =
    "selection:bg-primary rounded-md border-1 bg-transparent px-1 text-center not-placeholder-shown:translate-y-0 peer-placeholder-shown:-translate-y-0 peer-focus:-translate-y-0 focus:translate-y-0 dark:bg-transparent py-0";
  const labelStyle =
    "bg-background peer-focus:text-primary start-2 -translate-y-4.5 px-1 peer-focus:-translate-y-4.5 peer-focus:px-1";

  return (
    <div className="flex w-full items-center">
      <QuickTooltip content={t("property.number.tooltip.min")}>
        <div className={containerStyle}>
          <div className="relative flex w-full">
            <FloatingInput
              id={inputIdMin}
              ref={inputRefMin}
              defaultValue={defaultValueMin}
              onChange={onChangeMin}
              type="number"
              className={inputStyle}
            />
            <FloatingLabel htmlFor={inputIdMin} className={labelStyle}>
              {t("property.number.min-label")}
            </FloatingLabel>
          </div>
        </div>
      </QuickTooltip>

      <span className="text-muted-foreground px-1 text-sm">-</span>

      <QuickTooltip content={t("property.number.tooltip.max")}>
        <div className={containerStyle}>
          <div className="relative flex w-full">
            <FloatingInput
              id={inputIdMax}
              ref={inputRefMax}
              defaultValue={defaultValueMax}
              onChange={onChangeMax}
              type="number"
              className={inputStyle}
            />
            <FloatingLabel htmlFor={inputIdMax} className={labelStyle}>
              {t("property.number.max-label")}
            </FloatingLabel>
          </div>
        </div>
      </QuickTooltip>
    </div>
  );
});
