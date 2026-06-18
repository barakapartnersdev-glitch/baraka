// قراءة اللغة الحالية (خادم فقط).
// الأولوية: ترويسة x-locale (يضبطها middleware من بادئة المسار للصفحات العامة)،
// ثم كوكي اللغة (للبوّابات والمصادقة)، ثم اللغة الافتراضية.
import "server-only";
import { cookies, headers } from "next/headers";
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale, type Locale } from "@/lib/i18n";

export async function getLocale(): Promise<Locale> {
  const h = await headers();
  const fromHeader = h.get("x-locale");
  if (isLocale(fromHeader)) return fromHeader;

  const store = await cookies();
  const fromCookie = store.get(LOCALE_COOKIE)?.value;
  if (isLocale(fromCookie)) return fromCookie;

  return DEFAULT_LOCALE;
}
