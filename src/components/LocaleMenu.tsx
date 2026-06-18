"use client";
import { useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { setLocale } from "@/app/_i18n/actions";
import { localeHref, parseLocaleFromPath, type Locale } from "@/lib/i18n";

const LANGS: { code: Locale; label: string }[] = [
  { code: "ar", label: "ع" },
  { code: "en", label: "EN" },
  { code: "tr", label: "TR" },
  { code: "zh", label: "中" },
];

export default function LocaleMenu({ locale }: { locale: Locale }) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, start] = useTransition();

  function pick(code: Locale) {
    if (code === locale || pending) return;
    const { locale: pathLocale } = parseLocaleFromPath(pathname);
    start(async () => {
      if (pathLocale) {
        // صفحة عامة مُسبَقة بلغة → بدّل بادئة اللغة في الرابط
        router.push(localeHref(code, pathname));
      } else {
        // بوّابة/مصادقة (بلا لغة في الرابط) → بدّل عبر الكوكي
        await setLocale(code);
        router.refresh();
      }
    });
  }

  return (
    <div
      className="hidden items-center gap-1.5 text-[13px] text-[#cdd6e4] sm:flex"
      role="group"
      aria-label="Language"
    >
      {LANGS.map((l, i) => (
        <span key={l.code} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-white/25" aria-hidden="true">·</span>}
          <button
            type="button"
            onClick={() => pick(l.code)}
            disabled={pending}
            aria-current={l.code === locale}
            className={`px-0.5 transition hover:text-gold disabled:opacity-50 ${
              l.code === locale ? "font-bold text-gold" : ""
            }`}
          >
            {l.label}
          </button>
        </span>
      ))}
    </div>
  );
}
