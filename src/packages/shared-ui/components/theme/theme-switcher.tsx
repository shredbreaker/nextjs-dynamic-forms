"use client";

import { MonitorCog, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback } from "react";
import { QuickTooltip } from "@shared-ui/components/ui/quick-tooltip";
import { Toggle } from "@shared-ui/shadcn/components/ui/toggle";
import { useAppTranslations } from "@/i18n/app-translation.hooks";
import { ClientOnly } from "@/packages/shared-ui/components/client-only";

export function ThemeSwitcher({ className }: { className?: string }) {
  return (
    <ClientOnly>
      <ThemeSwitcherInner className={className} />
    </ClientOnly>
  );
}

export function ThemeSwitcherInner({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const { t } = useAppTranslations("Common");

  const cycleTheme = useCallback(() => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  }, [theme, setTheme]);

  const getAriaLabel = () => {
    switch (theme) {
      case "light":
        return "Switch to dark mode";
      case "dark":
        return "Switch to system mode";
      case "system":
        return "Switch to light mode";
      default:
        return "Switch theme";
    }
  };

  const getCurrentThemeTooltip = () => {
    switch (theme) {
      case "light":
        return t("Tooltips.Theme.Light");
      case "dark":
        return t("Tooltips.Theme.Dark");
      case "system":
        return t("Tooltips.Theme.System");
      default:
        return t("Tooltips.Theme.System");
    }
  };

  return (
    <div className={className}>
      <QuickTooltip content={getCurrentThemeTooltip()}>
        <div>
          <Toggle
            variant="outline"
            className="group data-[state=on]:hover:bg-muted size-9 hover:cursor-pointer data-[state=on]:bg-transparent"
            pressed={theme !== "light"}
            onPressedChange={cycleTheme}
            aria-label={getAriaLabel()}
          >
            {/* Light theme icon */}
            <SunIcon
              size={16}
              className={`shrink-0 transition-all ${
                theme === "light" ? "scale-100 opacity-100" : "absolute scale-0 opacity-0"
              }`}
              aria-hidden="true"
            />
            {/* Dark theme icon */}
            <MoonIcon
              size={16}
              className={`shrink-0 transition-all ${
                theme === "dark" ? "scale-100 opacity-100" : "absolute scale-0 opacity-0"
              }`}
              aria-hidden="true"
            />
            {/* System theme icon */}
            <MonitorCog
              size={16}
              className={`shrink-0 transition-all ${
                theme === "system" ? "scale-100 opacity-100" : "absolute scale-0 opacity-0"
              }`}
              aria-hidden="true"
            />
          </Toggle>
        </div>
      </QuickTooltip>
    </div>
  );
}
