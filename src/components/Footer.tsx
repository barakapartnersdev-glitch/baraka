import Link from "next/link";
import { getLocale } from "@/lib/i18n-server";
import { t } from "@/lib/i18n";

export default async function Footer() {
  const locale = await getLocale();

  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-5xl mx-auto px-6 py-10 grid gap-8 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-baraka-light flex items-center justify-center text-baraka-dark font-bold text-sm">
              ع
            </div>
            <span className="font-bold">{t(locale, "brand")}</span>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
            {t(locale, "footer.tagline")}
          </p>
          <p className="text-xs text-gray-400 mt-2">{t(locale, "footer.managedBy")}</p>
        </div>

        <div>
          <p className="font-bold text-sm mb-3">{t(locale, "footer.explore")}</p>
          <ul className="flex flex-col gap-2 text-sm text-gray-600">
            <li><Link href="/opportunities" className="hover:text-baraka">{t(locale, "nav.opportunities")}</Link></li>
            <li><Link href="/how-it-works" className="hover:text-baraka">{t(locale, "nav.how")}</Link></li>
            <li><Link href="/register" className="hover:text-baraka">{t(locale, "nav.register")}</Link></li>
            <li><Link href="/login" className="hover:text-baraka">{t(locale, "nav.login")}</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-bold text-sm mb-3">{t(locale, "footer.company")}</p>
          <ul className="flex flex-col gap-2 text-sm text-gray-600">
            <li><Link href="/about" className="hover:text-baraka">{t(locale, "nav.about")}</Link></li>
            <li><Link href="/contact" className="hover:text-baraka">{t(locale, "nav.contact")}</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-4 text-xs text-gray-400">
          {t(locale, "footer.rights")}
        </div>
      </div>
    </footer>
  );
}
