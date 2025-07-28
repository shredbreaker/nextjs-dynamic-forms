"use client";

import { ToggleGroup, ToggleGroupItem } from "@radix-ui/react-toggle-group";
import { memo } from "react";
import { cn } from "@shared-ui/lib/utils";
import { PropertyOptionSorting, PropertyOptionSortingSchema } from "@cms-data/modules/properties/property.types";
import { useCMSTranslations } from "@cms/i18n/use-cms-translation.hooks";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";
import {
  usePropertyMetaOptionMultiToggle,
  usePropertyMetaOptionSorting,
} from "@cms/modules/properties/form/fields/hooks/use-meta-option";

export const PropertyMetaOptionMultiToggle = memo(function PropertyMetaOptionMultiToggle() {
  useDebugRender("PropertyMetaOptionMultiToggle");
  const { isActive, handleToggle } = usePropertyMetaOptionMultiToggle();
  const { t } = useCMSTranslations();

  return (
    <ToggleGroup type="single" value={isActive ? "true" : "false"} onValueChange={handleToggle}>
      <ToggleGroupItem value="true">
        {isActive ? t("property.meta.option.multi.on.label") : t("property.meta.option.multi.off.label")}
      </ToggleGroupItem>
    </ToggleGroup>
  );
});

export const PropertyMetaOptionSortingToggle = memo(function PropertyMetaOptionSortingToggle() {
  useDebugRender("PropertyMetaOptionSortingToggle");
  const { value, setValue } = usePropertyMetaOptionSorting();
  const { t } = useCMSTranslations();
  console.log("value", value);
  return (
    <ToggleGroup
      className="flex space-x-2"
      type="single"
      value={value}
      onValueChange={(value) => setValue(value as PropertyOptionSorting)}
    >
      {PropertyOptionSortingSchema.options.map((sorting) => (
        <ToggleGroupItem
          key={sorting}
          value={sorting}
          className={cn("rounded-md px-2 py-1 text-sm", value === sorting && "bg-amber-400")}
        >
          {t(`property.meta.option.sorting.${sorting}.label`)}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
});
