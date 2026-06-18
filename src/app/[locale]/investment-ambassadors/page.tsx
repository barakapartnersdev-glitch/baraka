// الصفحة العامة «سفراء الاستثمار» — 4 لغات (RTL/LTR)، SEO مع canonical + hreflang، ونموذج التقديم.
import type { Metadata } from "next";
import Link from "next/link";
import PublicHeader from "@/components/PublicHeader";
import Footer from "@/components/Footer";
import { getLocale } from "@/lib/i18n-server";
import { ta } from "@/lib/ambassador-i18n";
import { LOCALES, DEFAULT_LOCALE, isLocale, localeHref } from "@/lib/i18n";
import AmbassadorForm from "./AmbassadorForm";

const PATH = "/investment-ambassadors";

function baseUrl(): string {
  return (process.env.APP_BASE_URL || "https://barakapartners.com").replace(/\/$/, "");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc = isLocale(locale) ? locale : DEFAULT_LOCALE;
  const base = baseUrl();

  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[l] = `${base}/${l}${PATH}`;
  languages["x-default"] = `${base}/${DEFAULT_LOCALE}${PATH}`;

  const url = `${base}/${loc}${PATH}`;
  const title = ta(loc, "seo.title");
  const description = ta(loc, "seo.desc");

  return {
    title,
    description,
    alternates: { canonical: url, languages },
    openGraph: { title, description, url, type: "website", siteName: "Baraka Partners" },
  };
}

// قائمة مفاتيح مرقّمة: prefix1..prefixN
function keys(prefix: string, n: number): string[] {
  return Array.from({ length: n }, (_, i) => `${prefix}${i + 1}`);
}

export default async function InvestmentAmbassadorsPage() {
  const locale = await getLocale();
  const t = (k: string) => ta(locale, k);

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-navy text-white">
          <div className="max-w-5xl mx-auto px-6 py-16 sm:py-20">
            <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-4">{t("hero.title")}</h1>
            <p className="text-[#cdd6e4] text-lg leading-relaxed max-w-3xl mb-8">{t("hero.sub")}</p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#apply"
                className="inline-flex items-center rounded-[10px] bg-gradient-to-br from-gold to-gold-soft px-6 py-3 text-sm font-bold text-navy transition hover:brightness-110"
              >
                {t("cta.apply")}
              </a>
              <a
                href="#how"
                className="inline-flex items-center rounded-[10px] border border-white/30 px-6 py-3 text-sm font-bold text-white transition hover:border-gold hover:text-gold"
              >
                {t("cta.how")}
              </a>
              <Link
                href={localeHref(locale, "/contact")}
                className="inline-flex items-center rounded-[10px] border border-white/30 px-6 py-3 text-sm font-bold text-white transition hover:border-gold hover:text-gold"
              >
                {t("cta.contact")}
              </Link>
            </div>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-6 py-14 flex flex-col gap-14">
          {/* من هو سفير الاستثمار؟ */}
          <section>
            <h2 className="text-2xl font-bold text-baraka-dark mb-3">{t("who.title")}</h2>
            <p className="text-gray-600 leading-relaxed mb-6 max-w-3xl">{t("who.lead")}</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {keys("who.p", 6).map((k) => (
                <li key={k} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-gold mt-0.5 shrink-0">●</span>
                  <span>{t(k)}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* من يمكنه التقديم؟ */}
          <section>
            <h2 className="text-2xl font-bold text-baraka-dark mb-5">{t("eligible.title")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {keys("eligible.i", 9).map((k) => (
                <div key={k} className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700">
                  {t(k)}
                </div>
              ))}
            </div>
          </section>

          {/* آلية العمل */}
          <section id="how" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-baraka-dark mb-5">{t("how.title")}</h2>
            <ol className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {keys("how.s", 11).map((k, i) => (
                <li key={k} className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-baraka-light text-baraka-dark text-xs font-bold">
                    {i + 1}
                  </span>
                  <span className="text-sm text-gray-700">{t(k)}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* ماذا يقدّم السفير / ماذا توفّر عهد البركة */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="text-xl font-bold text-baraka-dark mb-4">{t("provide.title")}</h2>
              <ul className="flex flex-col gap-2.5">
                {keys("provide.i", 7).map((k) => (
                  <li key={k} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-gold mt-0.5 shrink-0">✓</span>
                    <span>{t(k)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-baraka-light/50 p-6">
              <h2 className="text-xl font-bold text-baraka-dark mb-4">{t("offer.title")}</h2>
              <ul className="flex flex-col gap-2.5">
                {keys("offer.i", 9).map((k) => (
                  <li key={k} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-gold mt-0.5 shrink-0">✓</span>
                    <span>{t(k)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* تنبيه مهم */}
          <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <h2 className="text-lg font-bold text-amber-900 mb-3">{t("notice.title")}</h2>
            <p className="text-sm text-amber-800 leading-relaxed mb-3">{t("notice.b1")}</p>
            <p className="text-sm text-amber-800 leading-relaxed">{t("notice.b2")}</p>
          </section>

          {/* النموذج */}
          <section id="apply" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-baraka-dark mb-1">{t("form.title")}</h2>
            <p className="text-gray-500 text-sm mb-6 max-w-2xl">{t("form.sub")}</p>
            <AmbassadorForm locale={locale} />
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
