/* eslint-disable @next/next/no-img-element */
import PublicHeader from "@/components/PublicHeader";
import Footer from "@/components/Footer";
import { getLocale } from "@/lib/i18n-server";
import { t, isLocale, DEFAULT_LOCALE, localeHref, dir } from "@/lib/i18n";
import { pageMetadata, clampDescription } from "@/lib/seo";
import { ABOUT } from "@/lib/about-content";
import type { Metadata } from "next";

const SECTOR_IMAGES = [
  "/about/about-realestate.jpg",
  "/about/about-industry.jpg",
  "/about/about-agriculture.jpg",
  "/about/about-logistics.jpg",
];

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
      <main dir={d} className="bg-[#f7f1e7] text-[#171717]">
        {/* HERO */}
        <section className="relative min-h-[88vh] overflow-hidden">
          <div className="absolute inset-0">
            <img src="/about/about-realestate.jpg" alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-l from-black/90 via-black/65 to-black/25" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(207,169,92,0.35),transparent_28%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.12),transparent_32%)]" />
          </div>
          <div className="relative mx-auto flex min-h-[88vh] max-w-7xl items-center px-6 py-24">
            <div className="max-w-3xl">
              <div className="mb-6 inline-flex rounded-full border border-[#d7b56d]/50 bg-white/10 px-5 py-2 text-sm font-semibold text-[#e8cf91] backdrop-blur">
                {c.heroBadge}
              </div>
              <h1 className="text-4xl font-black leading-tight text-white md:text-6xl lg:text-7xl">
                {c.heroTitle1}
                <span className="mt-4 block text-[#d7b56d]">{c.heroTitle2}</span>
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-9 text-white/80 md:text-xl">{c.heroIntro}</p>
              <div className="mt-10 flex flex-wrap gap-4">
                <a href={oppsHref} className="rounded-full bg-[#d7b56d] px-8 py-4 text-sm font-bold text-[#171717] shadow-xl transition hover:-translate-y-1 hover:bg-[#e5c77d]">
                  {c.ctaOpps}
                </a>
                <a href={contactHref} className="rounded-full border border-white/25 bg-white/10 px-8 py-4 text-sm font-bold text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white/20">
                  {c.ctaContact}
                </a>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-black/35 backdrop-blur-xl">
            <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px px-6 py-5 md:grid-cols-4">
              {c.heroStats.map(([title, text]) => (
                <div key={title} className="px-4">
                  <div className="text-xl font-black text-[#d7b56d]">{title}</div>
                  <div className="mt-1 text-sm text-white/70">{text}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* IMAGE SECTORS STRIP */}
        <section className="mx-auto -mt-10 max-w-7xl px-6">
          <div className="relative z-10 grid gap-5 md:grid-cols-4">
            {c.sectors.map((title, i) => (
              <div key={title} className="group relative h-56 overflow-hidden rounded-3xl border border-white/50 bg-black shadow-2xl">
                <img src={SECTOR_IMAGES[i]} alt={title} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute bottom-5 right-5 left-5">
                  <h3 className="text-xl font-black text-white">{title}</h3>
                  <div className="mt-3 h-1 w-14 rounded-full bg-[#d7b56d]" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ABOUT */}
        <section className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-24 lg:grid-cols-2">
          <div className="relative">
            <div className="absolute -right-6 -top-6 h-56 w-56 rounded-full bg-[#d7b56d]/25 blur-3xl" />
            <div className="relative grid gap-5">
              <div className="overflow-hidden rounded-[2rem] border-8 border-white shadow-2xl">
                <img src="/about/about-meeting.jpg" alt="" loading="lazy" className="h-[420px] w-full object-cover" />
              </div>
              <div className="-mt-28 mr-auto w-[72%] overflow-hidden rounded-[2rem] border-8 border-[#f7f1e7] shadow-2xl">
                <img src="/about/about-office.jpg" alt="" loading="lazy" className="h-64 w-full object-cover" />
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm font-black tracking-wide text-[#a67c28]">{c.introKicker}</p>
            <h2 className="mt-4 text-3xl font-black leading-tight md:text-5xl">
              {c.introTitle1}
              <span className="block text-[#a67c28]">{c.introTitle2}</span>
            </h2>
            <div className="mt-7 space-y-5 text-lg leading-9 text-[#4d4d4d]">
              <p>
                <strong className="text-[#171717]">{c.brand}</strong>
                {c.intro1}
              </p>
              <p>{c.intro2}</p>
              <p>{c.intro3}</p>
            </div>
          </div>
        </section>

        {/* COUNTRIES / MAP */}
        <section className="relative overflow-hidden bg-[#171717] py-24 text-white">
          <div className="absolute inset-0 opacity-20">
            <img src="/about/about-map.jpg" alt="" loading="lazy" className="h-full w-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#171717]/95 via-[#171717]/80 to-[#171717]/95" />
          <div className="relative mx-auto max-w-7xl px-6">
            <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <p className="text-sm font-black text-[#d7b56d]">{c.countriesKicker}</p>
                <h2 className="mt-4 text-3xl font-black leading-tight md:text-5xl">{c.countriesTitle}</h2>
                <p className="mt-6 text-lg leading-9 text-white/70">{c.countriesIntro}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {c.countries.map((country) => (
                  <div key={country} className="rounded-3xl border border-white/10 bg-white/10 p-5 text-center backdrop-blur transition hover:-translate-y-1 hover:bg-[#d7b56d] hover:text-[#171717]">
                    <div className="mx-auto mb-4 h-3 w-3 rounded-full bg-[#d7b56d]" />
                    <div className="font-black">{country}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* VALUE */}
        <section className="mx-auto max-w-7xl px-6 py-24">
          <div className="mb-12 max-w-3xl">
            <p className="text-sm font-black text-[#a67c28]">{c.valueKicker}</p>
            <h2 className="mt-4 text-3xl font-black leading-tight md:text-5xl">{c.valueTitle}</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {c.valueCards.map((card, index) => (
              <div key={card.title} className="group relative overflow-hidden rounded-[2rem] border border-[#e3d5bd] bg-white p-7 shadow-sm transition hover:-translate-y-2 hover:shadow-2xl">
                <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-[#d7b56d]/20 blur-2xl transition group-hover:bg-[#d7b56d]/40" />
                <div className="relative">
                  <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#171717] text-xl font-black text-[#d7b56d]">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-black">{card.title}</h3>
                  <p className="mt-4 leading-8 text-[#5a5a5a]">{card.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* OPERATIONAL PARTNERS */}
        <section className="bg-white py-24">
          <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2">
            <div>
              <p className="text-sm font-black text-[#a67c28]">{c.opKicker}</p>
              <h2 className="mt-4 text-3xl font-black leading-tight md:text-5xl">{c.opTitle}</h2>
              <div className="mt-7 space-y-5 text-lg leading-9 text-[#4d4d4d]">
                {c.opParas.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
            <div className="relative overflow-hidden rounded-[2.5rem] shadow-2xl">
              <img src="/about/about-operation.jpg" alt="" loading="lazy" className="h-[520px] w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute bottom-8 right-8 left-8 rounded-3xl border border-white/15 bg-white/10 p-6 text-white backdrop-blur-xl">
                <h3 className="text-2xl font-black text-[#d7b56d]">{c.opCardTitle}</h3>
                <p className="mt-3 leading-8 text-white/80">{c.opCardText}</p>
              </div>
            </div>
          </div>
        </section>

        {/* BUSINESS MODEL */}
        <section className="relative overflow-hidden py-24">
          <div className="absolute inset-0">
            <img src="/about/about-model.jpg" alt="" loading="lazy" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-[#171717]/85" />
          </div>
          <div className="relative mx-auto max-w-7xl px-6">
            <div className="mb-12 max-w-3xl">
              <p className="text-sm font-black text-[#d7b56d]">{c.modelKicker}</p>
              <h2 className="mt-4 text-3xl font-black leading-tight text-white md:text-5xl">{c.modelTitle}</h2>
              <p className="mt-6 text-lg leading-9 text-white/70">{c.modelIntro}</p>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              {c.models.map((m) => (
                <div key={m.title} className="rounded-[2rem] border border-white/10 bg-white/10 p-8 text-white backdrop-blur-xl">
                  <h3 className="text-2xl font-black text-[#d7b56d]">{m.title}</h3>
                  <p className="mt-5 leading-8 text-white/75">{m.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PROCESS */}
        <section className="mx-auto max-w-7xl px-6 py-24">
          <div className="mb-12 text-center">
            <p className="text-sm font-black text-[#a67c28]">{c.processKicker}</p>
            <h2 className="mx-auto mt-4 max-w-4xl text-3xl font-black leading-tight md:text-5xl">{c.processTitle}</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3 lg:grid-cols-6">
            {c.process.map((step, index) => (
              <div key={step} className="relative rounded-[2rem] border border-[#e3d5bd] bg-white p-6 text-center shadow-sm">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#171717] text-lg font-black text-[#d7b56d]">
                  {index + 1}
                </div>
                <h3 className="font-black">{step}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* GOVERNANCE */}
        <section className="bg-white py-24">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
            <div className="overflow-hidden rounded-[2.5rem] shadow-2xl">
              <img src="/about/about-governance.jpg" alt="" loading="lazy" className="h-[480px] w-full object-cover" />
            </div>
            <div>
              <p className="text-sm font-black text-[#a67c28]">{c.govKicker}</p>
              <h2 className="mt-4 text-3xl font-black leading-tight md:text-5xl">
                {c.govTitle1}
                <span className="block text-[#a67c28]">{c.govTitle2}</span>
              </h2>
              <div className="mt-7 space-y-5 text-lg leading-9 text-[#4d4d4d]">
                {c.govParas.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="px-6 py-24">
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[3rem] bg-[#171717] px-8 py-20 text-center text-white shadow-2xl">
            <div className="absolute inset-0 opacity-25">
              <img src="/about/about-cta.jpg" alt="" loading="lazy" className="h-full w-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-[#171717]/75" />
            <div className="relative">
              <p className="text-sm font-black text-[#d7b56d]">{c.finalKicker}</p>
              <h2 className="mx-auto mt-4 max-w-4xl text-3xl font-black leading-tight md:text-5xl">{c.finalTitle}</h2>
              <p className="mx-auto mt-6 max-w-3xl text-lg leading-9 text-white/75">{c.finalIntro}</p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <a href="/register" className="rounded-full bg-[#d7b56d] px-9 py-4 text-sm font-black text-[#171717] transition hover:-translate-y-1 hover:bg-[#e5c77d]">
                  {c.ctaRegister}
                </a>
                <a href={contactHref} className="rounded-full border border-white/25 bg-white/10 px-9 py-4 text-sm font-black text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white/20">
                  {c.ctaContact2}
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
