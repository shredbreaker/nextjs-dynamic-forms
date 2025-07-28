"use client";

/**
 * @fileoverview PropertyTypeSelector - Enhanced dropdown type selector with icons and colors using shadcn DropdownMenu
 */
import { Type, Hash, ToggleLeft, List, Ruler, ChevronDown, Check } from "lucide-react";
import { memo } from "react";
import { cn } from "@shared-ui/lib/utils";
import { Button } from "@shared-ui/shadcn/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@shared-ui/shadcn/components/ui/dropdown-menu";
import { PropertyTypeSchema, type PropertyType } from "@cms-data/modules/properties/property.types";
import { useCMSTranslations } from "@cms/i18n/use-cms-translation.hooks";
import { usePropertyType } from "@cms/modules/properties/form/fields/hooks/use-type";

// Property type configuration with icons and colors
const PROPERTY_TYPE_CONFIG = {
  text: {
    icon: Type,
    color: "bg-blue-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-700",
    hoverBg: "hover:bg-blue-100",
  },
  number: {
    icon: Hash,
    color: "bg-green-500",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    textColor: "text-green-700",
    hoverBg: "hover:bg-green-100",
  },
  bool: {
    icon: ToggleLeft,
    color: "bg-purple-500",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    textColor: "text-purple-700",
    hoverBg: "hover:bg-purple-100",
  },
  option: {
    icon: List,
    color: "bg-orange-500",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    textColor: "text-orange-700",
    hoverBg: "hover:bg-orange-100",
  },
  size: {
    icon: Ruler,
    color: "bg-indigo-500",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
    textColor: "text-indigo-700",
    hoverBg: "hover:bg-indigo-100",
  },
} as const;

export const PropertyTypeSelector = memo(function PropertyTypeSelector() {
  const { t } = useCMSTranslations();
  const { propertyType, handleChange } = usePropertyType();

  if (!propertyType) throw new Error("PropertyTypeSelector must be used within a valid property context");

  const handleSelect = (type: PropertyType) => {
    handleChange(type);
  };

  const currentConfig = PROPERTY_TYPE_CONFIG[propertyType];
  const CurrentIcon = currentConfig?.icon || Type;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="text"
          size="sm"
          className={cn("has-[>svg]:pl-1", currentConfig?.borderColor, currentConfig?.textColor)}
          aria-haspopup="listbox"
        >
          <div className={cn("flex h-7 w-7 items-center justify-center rounded", currentConfig?.color)}>
            <CurrentIcon className="h-4 w-4 text-white" />
          </div>
          <ChevronDown className="h-4 w-4 transition-transform duration-200" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="min-w-[200px]">
        {PropertyTypeSchema.options.map((type) => {
          const config = PROPERTY_TYPE_CONFIG[type];
          const Icon = config.icon;
          const isSelected = propertyType === type;

          return (
            <DropdownMenuItem
              key={type}
              onClick={() => handleSelect(type)}
              className={cn("flex items-center gap-3 py-3", isSelected && "bg-accent")}
            >
              <div className={cn("flex h-7 w-7 items-center justify-center rounded", config.color)}>
                <Icon className="h-4 w-4 text-white" />
              </div>

              <div className="flex-1">
                <div className="font-medium">{t(`property.property_type.${type}`) || type}</div>
                <div className="text-xs opacity-70">{t(`property.property_type.${type}_description`) || ""}</div>
              </div>

              {isSelected && <Check className="text-primary h-4 w-4" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

PropertyTypeSelector.displayName = "PropertyTypeSelector";
