"use client";

import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { useLocale } from "next-intl";
import { ClientOnly } from "@shared-ui/components/client-only";
import { QuickTooltip } from "@shared-ui/components/ui/quick-tooltip";
import { Button } from "@shared-ui/shadcn/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@shared-ui/shadcn/components/ui/dropdown-menu";
import { getLanguageName } from "@/i18n/supported-locales";
import { useCMSTranslations } from "@cms/i18n/use-cms-translation.hooks";
import { useLocalization } from "./locale.context";
import { getFlagComponent } from "./localized-flag";

export default function LocaleSwitcher({
  variant = "icon",
  onSwitch,
}: {
  variant?: "default" | "icon";
  onSwitch?: (locale: string) => void;
}) {
  return (
    <ClientOnly>
      <LocaleSwitcherInner variant={variant} onSwitch={onSwitch} />
    </ClientOnly>
  );
}

function LocaleSwitcherInner({
  variant,
  onSwitch,
}: {
  variant: "default" | "icon";
  onSwitch?: (locale: string) => void;
}) {
  const { locales: contextLocales, switchLocale } = useLocalization();
  const currentLocale = useLocale();
  const { t } = useCMSTranslations();

  if (!currentLocale || !contextLocales || typeof switchLocale !== "function") {
    // Optionally return a loader or null, or rely on ClientOnly and context readiness
    return null;
  }

  const CurrentFlag = getFlagComponent(currentLocale);

  return (
    <div>
      <DropdownMenu>
        <QuickTooltip content={t("UI.Tooltips.SelectLanguage")}>
          <div>
            <DropdownMenuTrigger asChild>
              <div>
                {variant === "default" && (
                  <Button
                    variant="ghost"
                    aria-label="Select language"
                    className="flex items-center pr-2 hover:cursor-pointer"
                  >
                    <div className="flex items-center space-x-1.5">
                      <CurrentFlag className="h-3 w-4" aria-hidden="true" />
                      <span className="text-sm capitalize">{getLanguageName(currentLocale, currentLocale)}</span>
                    </div>
                  </Button>
                )}
                {variant === "icon" && (
                  <Button variant="outline" aria-label="Select language" className="bg-muted flex items-center pr-2">
                    <CurrentFlag className="h-3 w-4" aria-hidden="true" />
                    <ChevronDownIcon size={16} className="opacity-60" aria-hidden="true" />
                  </Button>
                )}
              </div>
            </DropdownMenuTrigger>
          </div>
        </QuickTooltip>
        <DropdownMenuContent className="min-w-[80px]">
          {contextLocales.map((locale) => {
            const FlagComponent = getFlagComponent(locale);
            return (
              <DropdownMenuItem
                key={locale}
                onClick={() => {
                  switchLocale(locale);
                  onSwitch?.(locale);
                }}
                className="flex items-center justify-between"
              >
                <span className="flex items-center gap-2 capitalize">
                  <FlagComponent className="h-3 w-4" />
                  {getLanguageName(locale, locale)}
                </span>
                {currentLocale === locale && <CheckIcon className="text-foreground" size={16} aria-hidden="true" />}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
