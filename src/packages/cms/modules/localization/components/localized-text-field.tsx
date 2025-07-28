"use client";
import { useLocale } from "next-intl";
import { useDeferredValue, useState } from "react";
import { useLocalization } from "@shared-ui/i18n/locale.context";
import { LocalizedText } from "@cms-data/modules/localization/localization.types";

export default function LocalizedTextField({
  localizedText,
  prefix,
  placeholder,
  isReadOnly = false,
}: {
  localizedText: LocalizedText;
  prefix: string;
  placeholder: string;
  isReadOnly?: boolean;
}) {
  const [values, setValues] = useState(localizedText || {});
  const [expanded, setExpanded] = useState(false);
  const formValues = useDeferredValue(values);

  const currentLocale = useLocale();
  const { locales } = useLocalization();
  const currentLanguageCode = currentLocale;
  const languageCodes = locales;

  const handleChange = (lang: string, value: string) => {
    setValues((prev) => ({
      ...prev,
      [lang]: value,
    }));
  };

  const sortedLanguageCodes = [currentLanguageCode, ...languageCodes.filter((lang) => lang !== currentLanguageCode)];

  const formElementName = (text: string) => {
    return `${prefix}[${text}]`;
  };
  return (
    <div className="flex flex-col">
      {/* Other languages shown when expanded */}

      <div>
        {sortedLanguageCodes.map((lang) => {
          if (!expanded && lang !== currentLanguageCode) {
            return null;
          }

          if (isReadOnly) {
            return <LocalizedLabelItem key={lang} lang={lang} formValues={formValues} />;
          } else {
            return (
              <LocalizedTextFieldItem
                key={lang}
                lang={lang}
                formValues={formValues}
                handleChange={handleChange}
                getFormElementName={formElementName}
                placeholder={placeholder}
                onLangClick={lang === currentLanguageCode ? () => setExpanded(!expanded) : undefined}
                isActive={lang === currentLanguageCode}
              />
            );
          }
        })}
      </div>
    </div>
  );
}

function LocalizedLabelItem({ lang, formValues }: { lang: string; formValues: LocalizedText }) {
  return <div className="min-w-16 pl-1 text-sm text-gray-500 capitalize">{formValues[lang]}</div>;
}

function LocalizedTextFieldItem({
  lang,
  formValues,
  handleChange,
  getFormElementName,
  placeholder,
  onLangClick = () => {},
  isActive = false,
}: {
  lang: string;
  formValues: LocalizedText;
  handleChange: (lang: string, value: string) => void;
  getFormElementName: (text: string) => string;
  placeholder: string;
  onLangClick?: (lang: string) => void;
  isActive?: boolean;
}) {
  return (
    <div key={lang} className="text-md my-1 flex items-center space-x-2">
      <div
        className={`min-w-5 text-sm text-slate-600 capitalize transition-all duration-250 select-none ${
          isActive ? "font-bold hover:cursor-pointer" : "font-medium hover:cursor-default"
        }`}
        onClick={() => isActive && onLangClick(lang)}
      >
        {lang}
      </div>
      <input
        type="text"
        name={getFormElementName(lang)}
        defaultValue={formValues[lang] || ""}
        onChange={(e) => handleChange(lang, e.target.value)}
        placeholder={placeholder}
        className="border-b border-b-slate-300 text-zinc-600 outline-none placeholder:text-sm"
      />
    </div>
  );
}
