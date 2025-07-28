import { useLocale } from "next-intl";
import { memo, useMemo } from "react";
import { useLocalization } from "@shared-ui/i18n/locale.context";
import { cn } from "@shared-ui/lib/utils";
import { getLanguageName } from "@/i18n/supported-locales";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";
import { useLayoutStore } from "@cms/modules/domain-editor/stores/layout-store/layout.store.hooks";

export const LanguageSelectionBar = memo(function LanguageSelectionBar() {
  useDebugRender("LanguageSelectionBar");
  const currentLocale = useLocale();
  const { locales } = useLocalization();
  const layoutStore = useLayoutStore();

  const currentTranslation = layoutStore((state) => state.currentTranslation);

  // Sort translations: current locale first, then alphabetically
  const sortedTranslations = useMemo(() => {
    return locales.sort((a: string, b: string) => {
      if (a === currentLocale) return -1;
      if (b === currentLocale) return 1;
      return a.localeCompare(b);
    });
  }, [currentLocale, locales]);

  const handleLanguageSelect = (language: string) => {
    // Only change if it's different - prevents deselection
    if (language !== (currentTranslation || currentLocale)) {
      layoutStore.getState().setCurrentTranslation(language);
    }
  };

  // Current value: null means current locale, otherwise the selected translation
  const selectedLanguage = currentTranslation || currentLocale;

  // List of language buttons
  const languageButtons = sortedTranslations.map((language) => {
    const isSelected = language === selectedLanguage;

    return (
      <button
        key={language}
        onClick={() => handleLanguageSelect(language)}
        className={cn(
          // Base styles
          "relative px-3 py-2 text-xs font-medium transition-colors",
          "focus-visible:ring-ring focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "hover:text-foreground hover:cursor-pointer",
          // Selected state with underline
          isSelected
            ? "text-primary after:bg-primary after:absolute after:inset-x-0 after:bottom-1 after:h-0.5"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <div className="flex items-center space-x-2">
          <span className="text-sm capitalize">{getLanguageName(language, currentLocale)}</span>
        </div>
      </button>
    );
  });

  return (
    <div className="flex flex-row items-center justify-center overflow-x-auto bg-transparent">{languageButtons}</div>
  );
});
