import Link from "next/link";
import { getLocale } from "@/lib/i18n-server";
import { t } from "@/lib/i18n";
import LocaleMenu from "@/components/LocaleMenu";

export default async function PublicHeader() {
  const locale = await getLocale();

  return (
    <header className="sticky top-0 z-50 border-b border-gold/20 bg-navy/90 backdrop-blur">
      <div className="mx-auto flex h-[74px] max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2.5 text-white">
          <span className="grid h-10 w-10 place-items-center rounded-[10px] bg-gradient-to-br from-gold to-gold-soft text-xl font-black text-navy">
            ب
          </span>
          <span className="font-extrabold leading-tight">
            {t(locale, "brand")}
            <small className="block text-[10px] font-medium tracking-[0.15em] text-gold-soft">
              BARAKA PARTNERS
            </small>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 whitespace-nowrap text-sm font-medium text-[#cdd6e4] lg:flex">
          <Link href="/opportunities" className="transition hover:text-gold">{t(locale, "nav.opportunities")}</Link>
          <Link href="/how-it-works" className="transition hover:text-gold">{t(locale, "nav.how")}</Link>
          <Link href="/about" className="transition hover:text-gold">{t(locale, "nav.about")}</Link>
          <Link href="/contact" className="transition hover:text-gold">{t(locale, "nav.contact")}</Link>
        </nav>

        <div className="flex shrink-0 items-center gap-3 sm:gap-4">
          <LocaleMenu locale={locale} />
          <span className="hidden h-6 w-px bg-white/15 sm:block" aria-hidden="true" />
          <Link
            href="/login"
            className="hidden whitespace-nowrap rounded-[10px] border border-white/30 px-4 py-2.5 text-sm font-bold text-white transition hover:border-gold hover:text-gold sm:inline-flex"
          >
            {t(locale, "nav.login")}
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-[10px] bg-gradient-to-br from-gold to-gold-soft px-5 py-2.5 text-sm font-bold text-navy transition hover:brightness-110"
          >
            {t(locale, "nav.register")}
          </Link>
        </div>
      </div>
    </header>
  );
}
