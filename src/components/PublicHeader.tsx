import Link from "next/link";
import { getLocale } from "@/lib/i18n-server";
import { t } from "@/lib/i18n";
import LocaleSwitcher from "@/components/LocaleSwitcher";

export default async function PublicHeader() {
  const locale = await getLocale();

  return (
    <header className="bg-white/90 backdrop-blur border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-baraka-light flex items-center justify-center text-baraka-dark font-bold text-sm">
            ع
          </div>
          <span className="font-bold text-sm">{t(locale, "brand")}</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/opportunities" className="text-gray-600 hover:text-baraka hidden sm:inline">
            {t(locale, "nav.opportunities")}
          </Link>
          <Link href="/how-it-works" className="text-gray-600 hover:text-baraka hidden sm:inline">
            {t(locale, "nav.how")}
          </Link>
          <Link href="/about" className="text-gray-600 hover:text-baraka hidden md:inline">
            {t(locale, "nav.about")}
          </Link>
          <Link href="/register" className="text-gray-600 hover:text-baraka">
            {t(locale, "nav.register")}
          </Link>
          <LocaleSwitcher locale={locale} />
          <Link
            href="/login"
            className="bg-baraka text-white px-4 py-1.5 rounded-lg hover:bg-baraka-dark transition"
          >
            {t(locale, "nav.login")}
          </Link>
        </nav>
      </div>
    </header>
  );
}
