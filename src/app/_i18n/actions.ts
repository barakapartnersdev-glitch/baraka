"use server";
// تبديل لغة الواجهة عبر كوكي (غير حسّاس — لا يحتاج HttpOnly).
import { cookies } from "next/headers";
import { LOCALES, LOCALE_COOKIE, type Locale } from "@/lib/i18n";

export async function setLocale(locale: Locale): Promise<void> {
  if (!LOCALES.includes(locale)) return;
  const store = await cookies();
  store.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
}
