import Link from "next/link";
import { getLocale } from "@/lib/i18n-server";
import { t, localeHref } from "@/lib/i18n";
import { getDestinationCards, destPath } from "@/lib/destinations";
import { destUi } from "@/lib/dest-i18n";
import { ta } from "@/lib/ambassador-i18n";
import { agentUi } from "@/lib/agent-i18n";

export default async function Footer() {
  const locale = await getLocale();
  const ui = destUi(locale);
  const footerDests = (await getDestinationCards(locale))
    .filter(({ dest }) => dest.showInFooter)
    .slice(0, 6);

  return (
    <footer className="bg-navy pt-14 pb-8 text-[#aebbcf]">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1.2fr]">
          <div>
            <div className="flex items-center gap-2.5 text-white">
              <img src="/logo-mark.png" alt="Baraka Partners" width={40} height={40} className="h-10 w-10 shrink-0 rounded-[10px]" />
              <span className="flex flex-col items-start font-extrabold leading-tight">
                <span className="block">{t(locale, "brand")}</span>
                <small className="block text-[10px] font-medium text-gold-soft">
                  <span className="inline-block tracking-[0.15em]">BARAKA PARTNERS</span>
                </small>
              </span>
            </div>
            <p className="mt-3.5 max-w-xs text-sm leading-relaxed">{t(locale, "footer.tagline")}</p>
          </div>

          <div>
            <h5 className="mb-4 font-bold text-white">{t(locale, "footer.explore")}</h5>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li><Link href={localeHref(locale, "/opportunities")} className="transition hover:text-gold">{t(locale, "nav.opportunities")}</Link></li>
              <li><Link href={localeHref(locale, "/how-it-works")} className="transition hover:text-gold">{t(locale, "nav.how")}</Link></li>
              <li><Link href={localeHref(locale, "/investment-ambassadors")} className="transition hover:text-gold">{ta(locale, "nav.ambassadors")}</Link></li>
              <li><Link href={localeHref(locale, "/asset-owner-agents")} className="transition hover:text-gold">{agentUi(locale).navLabel}</Link></li>
              <li><Link href="/register" className="transition hover:text-gold">{t(locale, "nav.register")}</Link></li>
              <li><Link href="/login" className="transition hover:text-gold">{t(locale, "nav.login")}</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="mb-4 font-bold text-white">{t(locale, "footer.company")}</h5>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li><Link href={localeHref(locale, "/about")} className="transition hover:text-gold">{t(locale, "nav.about")}</Link></li>
              <li><Link href={localeHref(locale, "/contact")} className="transition hover:text-gold">{t(locale, "nav.contact")}</Link></li>
            </ul>
          </div>

          {footerDests.length > 0 && (
            <div>
              <h5 className="mb-4 font-bold text-white">
                <Link href={`/${locale}/investment-destinations`} className="transition hover:text-gold">{ui.hub}</Link>
              </h5>
              <ul className="flex flex-col gap-2.5 text-sm">
                {footerDests.map(({ dest, tr }) => (
                  <li key={dest.id}>
                    <Link href={destPath(locale, tr.slug)} className="transition hover:text-gold">
                      {tr.h1Title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6 text-[13px]">
          <span>{t(locale, "footer.rights")}</span>
          <span>العربية · English · Türkçe · 中文</span>
        </div>
      </div>
    </footer>
  );
}
