import Link from "next/link";
import { getLocale } from "@/lib/i18n-server";
import { t } from "@/lib/i18n";

export default async function Footer() {
  const locale = await getLocale();

  return (
    <footer className="bg-navy pt-14 pb-8 text-[#aebbcf]">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5 text-white">
              <img src="/logo-mark.png" alt="Baraka Partners" width={40} height={40} className="h-10 w-10 shrink-0 rounded-[10px]" />
              <span className="font-extrabold leading-tight">
                {t(locale, "brand")}
                <small className="block text-[10px] font-medium tracking-[0.15em] text-gold-soft">
                  BARAKA PARTNERS
                </small>
              </span>
            </div>
            <p className="mt-3.5 max-w-xs text-sm leading-relaxed">{t(locale, "footer.tagline")}</p>
            <p className="mt-2 text-xs text-[#7e8aa0]">{t(locale, "footer.managedBy")}</p>
          </div>

          <div>
            <h5 className="mb-4 font-bold text-white">{t(locale, "footer.explore")}</h5>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li><Link href="/opportunities" className="transition hover:text-gold">{t(locale, "nav.opportunities")}</Link></li>
              <li><Link href="/how-it-works" className="transition hover:text-gold">{t(locale, "nav.how")}</Link></li>
              <li><Link href="/register" className="transition hover:text-gold">{t(locale, "nav.register")}</Link></li>
              <li><Link href="/login" className="transition hover:text-gold">{t(locale, "nav.login")}</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="mb-4 font-bold text-white">{t(locale, "footer.company")}</h5>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li><Link href="/about" className="transition hover:text-gold">{t(locale, "nav.about")}</Link></li>
              <li><Link href="/contact" className="transition hover:text-gold">{t(locale, "nav.contact")}</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6 text-[13px]">
          <span>{t(locale, "footer.rights")}</span>
          <span>العربية · English · Türkçe · 中文</span>
        </div>
      </div>
    </footer>
  );
}
