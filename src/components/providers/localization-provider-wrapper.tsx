"use client";
import { useParams, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { LocalizationProvider } from "@shared-ui/i18n/locale.provider";
import { usePathname, useRouter } from "@/i18n/navigation";
import { LOCALES, DEFAULT_LOCALE } from "@/i18n/supported-locales";

export function LocalizationProviderWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const [, startTransition] = useTransition();
  const currentPathnameWithoutLocale = usePathname();
  const currentSearchParams = useSearchParams();

  const switchLocale = (newLocale: string) => {
    startTransition(() => {
      const newQuery = new URLSearchParams(currentSearchParams.toString());

      const queryToPass: Record<string, string> = {};
      newQuery.forEach((value, key) => {
        queryToPass[key] = value;
      });

      router.replace(
        {
          pathname: currentPathnameWithoutLocale,
          ...(Object.keys(queryToPass).length > 0 && { query: queryToPass }),
        },
        { locale: newLocale },
      );
    });
  };

  return (
    <LocalizationProvider
      value={{
        locales: LOCALES,
        defaultLocale: DEFAULT_LOCALE,
        pathname: pathname,
        routeParams: params,
        switchLocale: switchLocale,
      }}
    >
      {children}
    </LocalizationProvider>
  );
}
