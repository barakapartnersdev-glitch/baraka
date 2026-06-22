import PublicHeader from "@/components/PublicHeader";
import Footer from "@/components/Footer";
import { getLocale } from "@/lib/i18n-server";
import { t, isLocale, DEFAULT_LOCALE, localeHref, dir } from "@/lib/i18n";
import { pageMetadata, clampDescription } from "@/lib/seo";
import { ABOUT } from "@/lib/about-content";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  return pageMetadata({
    locale,
    path: "/about",
    title: `${t(locale, "about.title")} | Baraka Partners`,
    description: clampDescription(ABOUT[locale].heroIntro),
  });
}

export default async function AboutPage() {
  const locale = await getLocale();
  const c = ABOUT[locale] ?? ABOUT[DEFAULT_LOCALE];
  const d = dir(locale);
  const oppsHref = localeHref(locale, "/opportunities");
  const contactHref = localeHref(locale, "/contact");

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main dir={d} className="bg-[#f8f5ef] text-[#171717]">
        {/* HERO */}
        <section className="relative overflow-hidden border-b border-[#e6dcc8]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#d7b56d33,transparent_35%),radial-gradient(circle_at_bottom_right,#11182712,transparent_35%)]" />
          <div className="relative mx-auto max-w-7xl px-6 py-20 lg:py-28">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <div className="mb-5 inline-flex items-center rounded-full border border-[#d6b66d] bg-white/70 px-4 py-2 text-sm font-medium text-[#8a6a24] shadow-sm">
                  {c.heroBadge}
                </div>
                <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-[#151515] md:text-6xl">
                  {c.heroTitle1}
                  <span className="block text-[#a67c28]">{c.heroTitle2}</span>
                </h1>
                <p className="mt-7 max-w-2xl text-lg leading-9 text-[#4b4b4b]">{c.heroIntro}</p>
                <div className="mt-9 flex flex-wrap gap-4">
                  <a href={oppsHref} className="rounded-full bg-[#171717] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#2a2a2a]">
                    {c.ctaOpps}
                  </a>
                  <a href={contactHref} className="rounded-full border border-[#c8ad6a] bg-white px-7 py-3 text-sm font-semibold text-[#171717] transition hover:bg-[#fffaf0]">
                    {c.ctaContact}
                  </a>
                </div>
              </div>

              <div className="relative">
                <div className="rounded-[2rem] border border-[#decfae] bg-white/80 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.08)] backdrop-blur">
                  <div className="rounded-[1.5rem] bg-[#171717] p-7 text-white">
                    <p className="text-sm text-[#d7b56d]">{c.cardKicker}</p>
                    <h2 className="mt-3 text-3xl font-bold leading-tight">{c.cardTitle}</h2>
                    <div className="mt-8 grid grid-cols-2 gap-4">
                      {c.stats.map(([num, label]) => (
                        <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                          <div className="text-2xl font-bold text-[#d7b56d]">{num}</div>
                          <div className="mt-2 text-sm text-white/75">{label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-5 grid grid-cols-3 gap-3 text-center text-sm font-medium text-[#5a4b2b]">
                    {c.countries.map((country) => (
                      <div key={country} className="rounded-xl border border-[#eadfca] bg-[#fbf8f0] px-3 py-3">
                        {country}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* INTRO */}
        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm font-semibold text-[#a67c28]">{c.introKicker}</p>
              <h2 className="mt-3 text-3xl font-bold leading-tight md:text-5xl">
                {c.introTitle1}
                <br />
                {c.introTitle2}
              </h2>
            </div>
            <div className="space-y-6 text-lg leading-9 text-[#4b4b4b]">
              <p>
                <strong className="text-[#171717]">{c.brand}</strong>
                {c.intro1}
              </p>
              <p>{c.intro2}</p>
              <p>{c.intro3}</p>
            </div>
          </div>
        </section>

        {/* VALUE PILLARS */}
        <section className="border-y border-[#e6dcc8] bg-white">
          <div className="mx-auto max-w-7xl px-6 py-20">
            <div className="mb-12 max-w-3xl">
              <p className="text-sm font-semibold text-[#a67c28]">{c.pillarsKicker}</p>
              <h2 className="mt-3 text-3xl font-bold md:text-5xl">{c.pillarsTitle}</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {c.pillars.map((item, index) => (
                <div key={item.title} className="group rounded-3xl border border-[#e6dcc8] bg-[#fbf8f0] p-7 transition hover:-translate-y-1 hover:shadow-xl">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#171717] text-lg font-bold text-[#d7b56d]">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-bold text-[#171717]">{item.title}</h3>
                  <p className="mt-4 leading-8 text-[#5a5a5a]">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MARKETS */}
        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid items-start gap-12 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-[#a67c28]">{c.marketsKicker}</p>
              <h2 className="mt-3 text-3xl font-bold leading-tight md:text-5xl">{c.marketsTitle}</h2>
              <p className="mt-6 text-lg leading-9 text-[#4b4b4b]">{c.marketsIntro}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {c.markets.map((market) => (
                <div key={market} className="rounded-2xl border border-[#e6dcc8] bg-white p-5 shadow-sm">
                  <div className="text-lg font-bold text-[#171717]">{market}</div>
                  <div className="mt-2 text-sm leading-6 text-[#666]">{c.marketDesc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BUSINESS MODEL */}
        <section className="bg-[#171717] text-white">
          <div className="mx-auto max-w-7xl px-6 py-20">
            <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <p className="text-sm font-semibold text-[#d7b56d]">{c.modelKicker}</p>
                <h2 className="mt-3 text-3xl font-bold leading-tight md:text-5xl">{c.modelTitle}</h2>
                <p className="mt-6 text-lg leading-9 text-white/70">{c.modelIntro}</p>
              </div>
              <div className="grid gap-5">
                {c.models.map((m) => (
                  <div key={m.title} className="rounded-3xl border border-white/10 bg-white/5 p-7">
                    <h3 className="text-2xl font-bold text-[#d7b56d]">{m.title}</h3>
                    <p className="mt-4 leading-8 text-white/75">{m.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTORS */}
        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-12 max-w-3xl">
            <p className="text-sm font-semibold text-[#a67c28]">{c.sectorsKicker}</p>
            <h2 className="mt-3 text-3xl font-bold md:text-5xl">{c.sectorsTitle}</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {c.sectors.map((sector) => (
              <div key={sector} className="rounded-2xl border border-[#e6dcc8] bg-white p-6 text-center font-bold text-[#171717] shadow-sm transition hover:border-[#d7b56d] hover:bg-[#fffaf0]">
                {sector}
              </div>
            ))}
          </div>
        </section>

        {/* PROCESS */}
        <section className="border-y border-[#e6dcc8] bg-white">
          <div className="mx-auto max-w-7xl px-6 py-20">
            <div className="mb-12 max-w-3xl">
              <p className="text-sm font-semibold text-[#a67c28]">{c.processKicker}</p>
              <h2 className="mt-3 text-3xl font-bold md:text-5xl">{c.processTitle}</h2>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              {c.steps.map((step, index) => (
                <div key={step.title} className="rounded-3xl border border-[#e6dcc8] bg-[#fbf8f0] p-7">
                  <div className="mb-5 text-4xl font-bold text-[#d7b56d]">{String(index + 1).padStart(2, "0")}</div>
                  <h3 className="text-xl font-bold">{step.title}</h3>
                  <p className="mt-4 leading-8 text-[#5a5a5a]">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* GOVERNANCE */}
        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="rounded-[2rem] border border-[#e6dcc8] bg-[#fbf8f0] p-8 md:p-12">
            <div className="grid gap-10 lg:grid-cols-2">
              <div>
                <p className="text-sm font-semibold text-[#a67c28]">{c.govKicker}</p>
                <h2 className="mt-3 text-3xl font-bold leading-tight md:text-5xl">{c.govTitle}</h2>
              </div>
              <div className="space-y-5 text-lg leading-9 text-[#4b4b4b]">
                {c.govParas.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="px-6 pb-24">
          <div className="mx-auto max-w-7xl rounded-[2rem] bg-[#171717] px-8 py-14 text-center text-white md:px-16">
            <p className="text-sm font-semibold text-[#d7b56d]">{c.finalKicker}</p>
            <h2 className="mx-auto mt-4 max-w-4xl text-3xl font-bold leading-tight md:text-5xl">{c.finalTitle}</h2>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-9 text-white/70">{c.finalIntro}</p>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <a href="/register" className="rounded-full bg-[#d7b56d] px-8 py-3 text-sm font-bold text-[#171717] transition hover:bg-[#e4c87f]">
                {c.ctaRegister}
              </a>
              <a href={contactHref} className="rounded-full border border-white/20 px-8 py-3 text-sm font-bold text-white transition hover:bg-white/10">
                {c.ctaContact2}
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
