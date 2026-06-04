"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { t, type Locale } from "@/lib/i18n";
import { setLocale } from "@/app/_i18n/actions";

export default function LocaleSwitcher({
  locale,
  className = "text-xs text-gray-500 hover:text-baraka transition disabled:opacity-50",
}: {
  locale: Locale;
  className?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const other: Locale = locale === "ar" ? "en" : "ar";

  function switchTo() {
    startTransition(async () => {
      await setLocale(other);
      router.refresh();
    });
  }

  return (
    <button
      onClick={switchTo}
      disabled={pending}
      className={className}
      aria-label="Switch language"
    >
      {/* يعرض اسم اللغة الأخرى للتبديل إليها */}
      {t(locale, "lang.switch")}
    </button>
  );
}
