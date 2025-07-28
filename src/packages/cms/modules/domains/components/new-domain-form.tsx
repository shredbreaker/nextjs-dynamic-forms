"use client";

import { useActionState } from "react";
import { DebugCard } from "@/packages/shared-ui/components/ui/debug-json-card";
import { useCMSTranslations } from "@cms/i18n/use-cms-translation.hooks";
import { Domain } from "@cms/modules/domains/domain.types";
import LocalizedTextField from "@cms/modules/localization/components/localized-text-field";
import { NewDomainProvider, useNewDomainContext } from "./new-domain.context";
import { NewDomainState } from "./new-domain.types";

type Props = {
  serverAction: (formState: NewDomainState, formData: FormData) => Promise<NewDomainState>;
};

export default function NewDomainForm({ serverAction }: Props) {
  const [formState, formAction] = useActionState(serverAction, {
    domain: null,
    error: null,
  } as NewDomainState);
  const { t } = useCMSTranslations();

  return (
    <div className="relative flex flex-col bg-slate-100 p-4">
      <NewDomainProvider>
        {/* Toolbar floats outside normal flow */}
        <div className="sticky top-0 z-50 flex flex-row items-start justify-between bg-slate-100 pt-2">
          <h1 className="ml-4 text-2xl font-bold">{t("domain_forms.create_title")}</h1>

          {/* Fade mask */}
          <div className="pointer-events-none absolute inset-x-0 top-full h-3 bg-gradient-to-b from-slate-100 to-transparent"></div>
        </div>

        <div className="relative z-10 mt-2">
          <form action={formAction} className="flex flex-col space-y-4">
            <NewDomainFormContent domain={formState.domain} />

            <button type="submit" className="cta-primary mt-4">
              {t("domain_forms.create_button")}
            </button>
          </form>
        </div>

        {formState.error && (
          <div className="mt-4 rounded-md bg-red-100 p-4 text-red-700">
            <p className="font-semibold">{t("domain_forms.error")}:</p>
            <p>{formState.error}</p>
          </div>
        )}

        <DebugCard json={formState} />
      </NewDomainProvider>
    </div>
  );
}

function NewDomainFormContent({ domain }: { domain: Domain | null }) {
  const { isDevMode } = useNewDomainContext();
  const { t } = useCMSTranslations();

  return (
    <div className="flex flex-col items-start justify-between">
      <div className="flex flex-col items-start justify-start space-x-4 rounded-lg bg-zinc-200 px-4 py-4 shadow-md ring-1 ring-zinc-200">
        <div className="flex w-full flex-col items-start justify-start gap-2">
          {/* Domain Name */}
          <div className="w-full">
            <label className="text-lg font-bold">{t("domain_forms.name_label")}</label>
            <LocalizedTextField
              localizedText={domain?.name ?? {}}
              prefix="name"
              placeholder={t("domain.name_placeholder")}
            />
          </div>

          {/* Basic Fields */}
          <div className={`flex flex-col gap-2 ${!isDevMode ? "hidden" : ""}`}>
            <label htmlFor="code">{t("domain.code")}</label>
            <input
              type="text"
              name="code"
              defaultValue={domain?.code ?? ""}
              placeholder={t("domain.code_placeholder")}
              className="w-full border-b border-b-zinc-300"
            />
          </div>

          <div className={`flex flex-col gap-2 ${!isDevMode ? "hidden" : ""}`}>
            <label htmlFor="system_description">{t("domain.system_description")}</label>
            <input
              type="text"
              name="system_description"
              defaultValue={domain?.meta?.system_description ?? ""}
              placeholder={t("domain.system_description_placeholder")}
              className="w-full border-b border-b-zinc-300"
            />
          </div>

          <div className={`flex flex-row gap-2 ${!isDevMode ? "hidden" : ""}`}>
            <label htmlFor="display_order">{t("domain_forms.display_order")}</label>
            <input
              type="number"
              name="display_order"
              defaultValue={domain?.display_order ?? 0}
              className="border-b border-b-zinc-300"
            />
          </div>

          <div className={`flex flex-row justify-start gap-4 ${!isDevMode ? "hidden" : ""}`}>
            <div className="flex flex-row gap-2">
              <label htmlFor="is_active">{t("domain_forms.active")}</label>
              <input type="checkbox" name="is_active" defaultChecked={domain?.is_active ?? false} />
            </div>
            <div className="flex flex-row gap-2">
              <label htmlFor="is_locked">{t("domain_forms.locked")}</label>
              <input type="checkbox" name="is_locked" defaultChecked={domain?.is_locked ?? false} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
