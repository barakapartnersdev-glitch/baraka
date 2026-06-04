// قراءة اللغة الحالية من الكوكي (خادم فقط).
import "server-only";
import { cookies } from "next/headers";
import { DEFAULT_LOCALE, LOCALES, LOCALE_COOKIE, type Locale } from "@/lib/i18n";

export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const v = store.get(LOCALE_COOKIE)?.value as Locale | undefined;
  return v && LOCALES.includes(v) ? v : DEFAULT_LOCALE;
}
