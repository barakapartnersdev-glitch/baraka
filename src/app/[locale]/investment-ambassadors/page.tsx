// الصفحة العامة «سفراء الاستثمار» — تصميم فاخر، 4 لغات (RTL/LTR)، SEO، ونموذج التقديم الحقيقي.
/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import PublicHeader from "@/components/PublicHeader";
import Footer from "@/components/Footer";
import { getLocale } from "@/lib/i18n-server";
import { ta } from "@/lib/ambassador-i18n";
import { LOCALES, DEFAULT_LOCALE, isLocale, dir } from "@/lib/i18n";
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
  const d = dir(locale);
  // التدرّج الداكن يبدأ من جهة النص (يمين في RTL، يسار في LTR) ليبقى مقروءاً.
  const heroGrad = d === "rtl" ? "bg-gradient-to-l" : "bg-gradient-to-r";

  const stats: [string, string][] = [
    [t("hx.stat1t"), t("hx.stat1s")],
    [t("hx.stat2t"), t("hx.stat2s")],
    [t("hx.stat3t"), t("hx.stat3s")],
    [t("hx.stat4t"), t("hx.stat4s")],
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main dir={d} className="bg-[#f7f1e7] text-[#171717]">
        {/* HERO */}
        <section className="relative min-h-[92vh] overflow-hidden">
          <div className="absolute inset-0">
            <img src="/ambassadors/hero2.jpg" alt={t("hx.badge")} className="h-full w-full object-cover object-center" />
            <div className={`absolute inset-0 ${heroGrad} from-black/92 via-black/70 to-black/30`} />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(215,181,109,0.36),transparent_28%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.10),transparent_30%)]" />
          </div>
          <div className="relative mx-auto flex min-h-[92vh] max-w-7xl items-center px-6 py-24">
            <div className="max-w-4xl">
              <div className="mb-6 inline-flex rounded-full border border-[#d7b56d]/50 bg-white/10 px-5 py-2 text-sm font-black text-[#e8cf91] backdrop-blur">
                {t("hx.badge")}
              </div>
              <h1 className="text-4xl font-black leading-tight text-white md:text-6xl lg:text-7xl">
                {t("hero.title")}
                <span className="mt-4 block text-[#d7b56d]">{t("hx.heroGold")}</span>
              </h1>
              <p className="mt-7 max-w-3xl text-lg leading-9 text-white/80 md:text-xl">{t("hero.sub")}</p>
              <div className="mt-10 flex flex-wrap gap-4">
                <a href="#apply" className="rounded-full bg-[#d7b56d] px-8 py-4 text-sm font-black text-[#171717] shadow-xl transition hover:-translate-y-1 hover:bg-[#e5c77d]">
                  {t("cta.apply")}
                </a>
                <a href="#how" className="rounded-full border border-white/25 bg-white/10 px-8 py-4 text-sm font-black text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white/20">
                  {t("cta.how")}
                </a>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-black/35 backdrop-blur-xl">
            <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px px-6 py-5 md:grid-cols-4">
              {stats.map(([title, sub]) => (
                <div key={title} className="px-4">
                  <div className="text-xl font-black text-[#d7b56d]">{title}</div>
                  <div className="mt-1 text-sm text-white/70">{sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHO IS AN AMBASSADOR */}
        <section className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-24 lg:grid-cols-2">
          <div className="relative">
            <div className="absolute -right-8 -top-8 h-60 w-60 rounded-full bg-[#d7b56d]/25 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2.8rem] shadow-2xl">
              <img src="/about/about-meeting.jpg" alt="" loading="lazy" className="h-[560px] w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
              <div className="absolute bottom-8 right-8 left-8 rounded-3xl border border-white/15 bg-white/10 p-6 text-white backdrop-blur-xl">
                <h3 className="text-2xl font-black text-[#d7b56d]">{t("hx.whoCardTitle")}</h3>
                <p className="mt-3 leading-8 text-white/80">{t("hx.whoCardText")}</p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm font-black text-[#a67c28]">{t("who.title")}</p>
            <h2 className="mt-4 text-3xl font-black leading-tight md:text-5xl">
              {t("hx.whoH2a")}
              <span className="block text-[#a67c28]">{t("hx.whoH2b")}</span>
            </h2>
            <div className="mt-7 space-y-5 text-lg leading-9 text-[#4d4d4d]">
              <p>{t("who.lead")}</p>
              <p>{t("hx.whoPara2")}</p>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {keys("who.p", 4).map((k) => (
                <div key={k} className="rounded-3xl border border-[#e3d5bd] bg-white p-5 font-bold shadow-sm">
                  <span className="text-[#a67c28]">✓</span> {t(k)}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHO CAN APPLY */}
        <section className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12 max-w-3xl">
              <p className="text-sm font-black text-[#a67c28]">{t("eligible.title")}</p>
              <h2 className="mt-4 text-3xl font-black leading-tight md:text-5xl">{t("hx.eligibleH2")}</h2>
              <p className="mt-5 text-lg leading-9 text-[#555]">{t("hx.eligibleLead")}</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {keys("eligible.i", 8).map((k) => (
                <div key={k} className="group rounded-[2rem] border border-[#e3d5bd] bg-[#f7f1e7] p-7 shadow-sm transition hover:-translate-y-2 hover:border-[#d7b56d] hover:shadow-xl">
                  <div className="mb-5 h-2 w-14 rounded-full bg-[#d7b56d]" />
                  <h3 className="text-xl font-black">{t(k)}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PROCESS */}
        <section id="how" className="mx-auto max-w-7xl scroll-mt-24 px-6 py-24">
          <div className="mb-14 text-center">
            <p className="text-sm font-black text-[#a67c28]">{t("how.title")}</p>
            <h2 className="mx-auto mt-4 max-w-4xl text-3xl font-black leading-tight md:text-5xl">{t("hx.howH2")}</h2>
            <p className="mx-auto mt-5 max-w-3xl text-lg leading-9 text-[#555]">{t("hx.howLead")}</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {keys("how.s", 11).map((k, i) => (
              <div key={k} className="flex gap-5 rounded-[2rem] border border-[#e3d5bd] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <div className="text-4xl font-black leading-none text-[#d7b56d]">{String(i + 1).padStart(2, "0")}</div>
                <p className="leading-8 text-[#444]">{t(k)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* RESPONSIBILITIES & BENEFITS */}
        <section className="relative overflow-hidden bg-[#171717] py-24 text-white">
          <div className="absolute inset-0 opacity-25">
            <img src="/about/about-map.jpg" alt="" loading="lazy" className="h-full w-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-[#171717]/88" />
          <div className="relative mx-auto max-w-7xl px-6">
            <div className="mb-12 max-w-3xl">
              <p className="text-sm font-black text-[#d7b56d]">{t("hx.respKicker")}</p>
              <h2 className="mt-4 text-3xl font-black leading-tight md:text-5xl">{t("hx.respH2")}</h2>
            </div>
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="rounded-[2.5rem] border border-white/10 bg-white/10 p-8 backdrop-blur-xl">
                <h3 className="text-3xl font-black text-[#d7b56d]">{t("provide.title")}</h3>
                <div className="mt-8 grid gap-4">
                  {keys("provide.i", 7).map((k) => (
                    <div key={k} className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                      <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#d7b56d] text-xs font-black text-[#171717]">✓</span>
                      <span className="leading-7 text-white/80">{t(k)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-[2.5rem] border border-white/10 bg-white/10 p-8 backdrop-blur-xl">
                <h3 className="text-3xl font-black text-[#d7b56d]">{t("offer.title")}</h3>
                <div className="mt-8 grid gap-4">
                  {keys("offer.i", 9).map((k) => (
                    <div key={k} className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                      <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#d7b56d] text-xs font-black text-[#171717]">✓</span>
                      <span className="leading-7 text-white/80">{t(k)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WARNING */}
        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="rounded-[2.5rem] border border-[#d7b56d] bg-[#fff8e8] p-8 md:p-12">
            <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
              <div>
                <p className="text-sm font-black text-[#a67c28]">{t("notice.title")}</p>
                <h2 className="mt-3 text-3xl font-black leading-tight">{t("hx.warnH2")}</h2>
              </div>
              <div className="space-y-5 text-lg leading-9 text-[#4d4d4d]">
                <p>{t("notice.b1")}</p>
                <p>{t("notice.b2")}</p>
              </div>
            </div>
          </div>
        </section>

        {/* APPLICATION FORM */}
        <section id="apply" className="scroll-mt-24 bg-white py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12 max-w-3xl">
              <p className="text-sm font-black text-[#a67c28]">{t("hx.formKicker")}</p>
              <h2 className="mt-4 text-3xl font-black leading-tight md:text-5xl">{t("form.title")}</h2>
              <p className="mt-5 text-lg leading-9 text-[#555]">{t("form.sub")}</p>
            </div>
            <AmbassadorForm locale={locale} />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
