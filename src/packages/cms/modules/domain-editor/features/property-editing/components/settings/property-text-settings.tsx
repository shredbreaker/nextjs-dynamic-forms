"use client";

import { AlignJustify, TextCursorInput } from "lucide-react";
import { memo, useCallback, useContext, useState } from "react";
import { QuickTooltip } from "@shared-ui/components/ui/quick-tooltip";
import { FloatingInput, FloatingLabel } from "@shared-ui/shadcn/components/ui/floating-label-input";
import { ToggleGroup, ToggleGroupItem } from "@shared-ui/shadcn/components/ui/toggle-group";
import { useCMSTranslations } from "@cms/i18n";
import { PropertyRowContext } from "@cms/modules/domain-editor/contexts";
import { useReactiveValue } from "@cms/modules/domain-editor/hooks/use-property";
import { FormProperty } from "@cms/modules/properties/form/types";
import { PropertyMetaText } from "@cms/modules/properties/property.types";

export const PropertyTextSettings = memo(function PropertyTextSettings() {
  return (
    <div className="flex w-full flex-row items-center justify-between space-x-1">
      <div className="flex px-1">
        <PropertyTextMaxLengthSettings />
      </div>
      <div className="flex items-center px-1">
        <PropertyTextMultilineSettings />
      </div>
    </div>
  );
});

export const PropertyTextMultilineSettings = memo(function PropertyTextMultilineSettings() {
  const { t } = useCMSTranslations();
  const getMultilineValue = useCallback((property: FormProperty) => {
    if (property.meta?.type === "text") {
      const result = property.meta.multiline === true ? "multiline" : "single";
      return result;
    }
    return "single";
  }, []);

  const setMultilineValue = useCallback((draft: FormProperty, value: string) => {
    if (!draft.meta) draft.meta = { type: "text", multiline: false };
    const isMultiline = value === "multiline";
    (draft.meta as PropertyMetaText).multiline = isMultiline;
  }, []);

  const { value: currentValue, setValue: setCurrentValue } = useReactiveValue<string>({
    getValue: getMultilineValue,
    setValue: setMultilineValue,
  });

  const handleValueChange = useCallback(
    (value: string) => {
      if (value) {
        setCurrentValue(value);
      }
    },
    [setCurrentValue],
  );

  const displayValue = currentValue || "single";

  const toggleStyle = "flex h-8 min-w-12 items-center justify-center font-bold tracking-wider text-muted-foreground";

  return (
    <div className="flex w-full items-center justify-center px-1 pb-0">
      <ToggleGroup
        type="single"
        value={displayValue}
        onValueChange={handleValueChange}
        className="bg-background border-input rounded-md border"
      >
        <QuickTooltip content={t("property.text.single-line")}>
          <div>
            <ToggleGroupItem value="single" className={toggleStyle}>
              <TextCursorInput />
            </ToggleGroupItem>
          </div>
        </QuickTooltip>
        <QuickTooltip content={t("property.text.multiline")}>
          <div>
            <ToggleGroupItem value="multiline" className={toggleStyle}>
              <AlignJustify />
            </ToggleGroupItem>
          </div>
        </QuickTooltip>
      </ToggleGroup>
    </div>
  );
});

export const PropertyTextMaxLengthSettings = memo(function PropertyTextMaxLengthSettings() {
  const { t } = useCMSTranslations();
  const { propertyId } = useContext(PropertyRowContext)!;

  const maxDefaultValue = 4096;
  const minDefaultValue = 1;
  const getStoreValue = useCallback(
    (property: FormProperty) => {
      const value = property.meta?.type === "text" ? property.meta.max : undefined;
      return value ?? maxDefaultValue;
    },
    [maxDefaultValue],
  );

  const setStoreValue = useCallback(
    (draft: FormProperty, value: number) => {
      if (!draft.meta) draft.meta = { type: "text", multiline: false };
      (draft.meta as PropertyMetaText).max = value || maxDefaultValue;
    },
    [maxDefaultValue],
  );

  const { value: maxValue, setValue: setMaxValue } = useReactiveValue<number>({
    getValue: getStoreValue,
    setValue: setStoreValue,
  });

  const [displayValue, setDisplayValue] = useState<string>(maxValue?.toString() || "");

  const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayValue(event.target.value);
  }, []);

  const handleBlur = useCallback(() => {
    const numValue = Number(displayValue);
    const getFinalValue = () => {
      if (displayValue === "" || isNaN(numValue)) {
        return maxDefaultValue;
      } else if (numValue < minDefaultValue) {
        return maxDefaultValue;
      } else {
        return numValue;
      }
    };
    const finalValue = getFinalValue();
    setMaxValue(finalValue);
    setDisplayValue(finalValue.toString());
  }, [displayValue, setMaxValue, maxDefaultValue, minDefaultValue]);

  const inputIdMax = `property-text-input-${propertyId}-max`;

  const containerStyle = "flex h-14 flex-col items-start justify-center space-y-0";
  const inputStyle =
    "selection:bg-primary rounded-md border-1 bg-transparent px-1 text-center not-placeholder-shown:translate-y-0 peer-placeholder-shown:-translate-y-0 peer-focus:-translate-y-0 focus:translate-y-0 dark:bg-transparent py-0";
  const labelStyle =
    "bg-background peer-focus:text-primary start-2 -translate-y-4.5 px-1 peer-focus:-translate-y-4.5 peer-focus:px-1";

  return (
    <div className="flex w-full items-center justify-start">
      <QuickTooltip content={t("property.text.max-label")}>
        <div className={containerStyle}>
          <div className="relative flex w-full">
            <FloatingInput
              id={inputIdMax}
              value={displayValue}
              onChange={onChange}
              onBlur={handleBlur}
              type="number"
              className={inputStyle}
              min={minDefaultValue}
            />
            <FloatingLabel htmlFor={inputIdMax} className={labelStyle}>
              {t("property.text.max-label")}
            </FloatingLabel>
          </div>
        </div>
      </QuickTooltip>
    </div>
  );
});
