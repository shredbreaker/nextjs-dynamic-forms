import { useLocale } from "next-intl";
import { redirect } from "@/i18n/navigation";
export default function Home() {
  const locale = useLocale();
  redirect({ href: "/domain-editor/001", locale: locale });
}
