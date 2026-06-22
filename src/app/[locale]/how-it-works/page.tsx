/* eslint-disable @next/next/no-img-element */
import PublicHeader from "@/components/PublicHeader";
import Footer from "@/components/Footer";
import { getLocale } from "@/lib/i18n-server";
import { t, isLocale, DEFAULT_LOCALE, localeHref, dir } from "@/lib/i18n";
import { pageMetadata, clampDescription } from "@/lib/seo";
import { HOW } from "@/lib/how-content";
import type { Metadata } from "next";

const STEP_IMAGES = [
  "/about/about-model.jpg",
  "/about/about-governance.jpg",
  "/about/about-meeting.jpg",
  "/how-it-works/matching.jpg",
  "/how-it-works/details.jpg",
  "/how-it-works/negotiation.jpg",
];
const TRACK_IMAGES = ["/how-it-works/investors.jpg", "/about/about-realestate.jpg"];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  return pageMetadata({
    locale,
    path: "/how-it-works",
    title: `${t(locale, "how.title")} | Baraka Partners`,
    description: clampDescription(HOW[locale].heroIntro),
  });
}

export default async function HowItWorksPage() {
  const locale = await getLocale();
  const c = HOW[locale] ?? HOW[DEFAULT_LOCALE];
  const d = dir(locale);
  const registerHref = "/register";
  const submitHref = localeHref(locale, "/submit-opportunity");
  const trackHrefs = [registerHref, submitHref];

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main dir={d} className="bg-[#f7f1e7] text-[#171717]">
        {/* HERO */}
        <section className="relative min-h-[88vh] overflow-hidden">
          <div className="absolute inset-0">
            <img src="/how-it-works/hero.jpg" alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-l from-black/90 via-black/70 to-black/30" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(215,181,109,0.32),transparent_30%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.12),transparent_28%)]" />
          </div>
          <div className="relative mx-auto flex min-h-[88vh] max-w-7xl items-center px-6 py-24">
            <div className="max-w-4xl">
              <div className="mb-6 inline-flex rounded-full border border-[#d7b56d]/50 bg-white/10 px-5 py-2 text-sm font-black text-[#e8cf91] backdrop-blur">
                {c.heroBadge}
              </div>
              <h1 className="text-4xl font-black leading-tight text-white md:text-6xl lg:text-7xl">
                {c.heroTitle1}
                <span className="mt-4 block text-[#d7b56d]">{c.heroTitle2}</span>
              </h1>
              <p className="mt-7 max-w-3xl text-lg leading-9 text-white/80 md:text-xl">{c.heroIntro}</p>
              <div className="mt-10 flex flex-wrap gap-4">
                <a href={registerHref} className="rounded-full bg-[#d7b56d] px-8 py-4 text-sm font-black text-[#171717] shadow-xl transition hover:-translate-y-1 hover:bg-[#e5c77d]">
                  {c.ctaInvestor}
                </a>
                <a href={submitHref} className="rounded-full border border-white/25 bg-white/10 px-8 py-4 text-sm font-black text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white/20">
                  {c.ctaOwner}
                </a>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-black/35 backdrop-blur-xl">
            <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px px-6 py-5 md:grid-cols-4">
              {c.heroStats.map(([num, label]) => (
                <div key={label} className="px-4">
                  <div className="text-2xl font-black text-[#d7b56d]">{num}</div>
                  <div className="mt-1 text-sm font-semibold text-white/75">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* INTRO */}
        <section className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-24 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-black text-[#a67c28]">{c.introKicker}</p>
            <h2 className="mt-4 text-3xl font-black leading-tight md:text-5xl">
              {c.introTitle1}
              <span className="block text-[#a67c28]">{c.introTitle2}</span>
            </h2>
          </div>
          <div className="space-y-5 text-lg leading-9 text-[#4d4d4d]">
            {c.introParas.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>

        {/* TWO TRACKS */}
        <section className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12 max-w-3xl">
              <p className="text-sm font-black text-[#a67c28]">{c.tracksKicker}</p>
              <h2 className="mt-4 text-3xl font-black leading-tight md:text-5xl">{c.tracksTitle}</h2>
            </div>
            <div className="grid gap-8 lg:grid-cols-2">
              {c.tracks.map((track, ti) => (
                <div key={track.title} className="group overflow-hidden rounded-[2.5rem] border border-[#e3d5bd] bg-[#f7f1e7] shadow-sm transition hover:-translate-y-2 hover:shadow-2xl">
                  <div className="relative h-72 overflow-hidden">
                    <img src={TRACK_IMAGES[ti]} alt={track.title} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                    <h3 className="absolute bottom-7 right-7 text-3xl font-black text-white">{track.title}</h3>
                  </div>
                  <div className="p-8">
                    <ul className="space-y-4">
                      {track.points.map((point) => (
                        <li key={point} className="flex gap-3 leading-8 text-[#4d4d4d]">
                          <span className="mt-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#171717] text-xs font-black text-[#d7b56d]">✓</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                    <a href={trackHrefs[ti]} className="mt-8 inline-flex rounded-full bg-[#171717] px-7 py-3 text-sm font-black text-white transition hover:bg-[#2a2a2a]">
                      {track.cta}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MAIN PROCESS */}
        <section className="mx-auto max-w-7xl px-6 py-24">
          <div className="mb-14 text-center">
            <p className="text-sm font-black text-[#a67c28]">{c.processKicker}</p>
            <h2 className="mx-auto mt-4 max-w-4xl text-3xl font-black leading-tight md:text-5xl">{c.processTitle}</h2>
          </div>
          <div className="space-y-8">
            {c.steps.map((step, index) => (
              <div
                key={step.number}
                className={`grid overflow-hidden rounded-[2.5rem] border border-[#e3d5bd] bg-white shadow-sm lg:grid-cols-2 ${index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}
              >
                <div className="relative h-80 overflow-hidden lg:h-auto">
                  <img src={STEP_IMAGES[index]} alt={step.title} loading="lazy" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                </div>
                <div className="flex items-center p-8 md:p-12">
                  <div>
                    <div className="mb-6 text-6xl font-black text-[#d7b56d]">{step.number}</div>
                    <h3 className="text-3xl font-black leading-tight">{step.title}</h3>
                    <p className="mt-5 text-lg leading-9 text-[#555]">{step.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PRIVACY LADDER */}
        <section className="relative overflow-hidden bg-[#171717] py-24 text-white">
          <div className="absolute inset-0 opacity-25">
            <img src="/how-it-works/privacy.jpg" alt="" loading="lazy" className="h-full w-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-[#171717]/88" />
          <div className="relative mx-auto max-w-7xl px-6">
            <div className="mb-14 max-w-3xl">
              <p className="text-sm font-black text-[#d7b56d]">{c.privacyKicker}</p>
              <h2 className="mt-4 text-3xl font-black leading-tight md:text-5xl">{c.privacyTitle}</h2>
              <p className="mt-6 text-lg leading-9 text-white/70">{c.privacyIntro}</p>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              {c.privacyLevels.map((level, index) => (
                <div key={level.title} className="rounded-[2rem] border border-white/10 bg-white/10 p-8 backdrop-blur-xl">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#d7b56d] text-2xl font-black text-[#171717]">
                    {index + 1}
                  </div>
                  <div className="mb-3 inline-flex rounded-full border border-[#d7b56d]/40 px-4 py-1 text-xs font-black text-[#d7b56d]">
                    {level.tag}
                  </div>
                  <h3 className="text-2xl font-black">{level.title}</h3>
                  <p className="mt-5 leading-8 text-white/75">{level.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BEYOND BROKERAGE */}
        <section className="bg-white py-24">
          <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2">
            <div className="relative overflow-hidden rounded-[2.5rem] shadow-2xl">
              <img src="/about/about-operation.jpg" alt="" loading="lazy" className="h-[520px] w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
              <div className="absolute bottom-8 right-8 left-8 rounded-3xl border border-white/15 bg-white/10 p-6 text-white backdrop-blur-xl">
                <h3 className="text-2xl font-black text-[#d7b56d]">{c.beyondCardTitle}</h3>
                <p className="mt-3 leading-8 text-white/80">{c.beyondCardText}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-black text-[#a67c28]">{c.beyondKicker}</p>
              <h2 className="mt-4 text-3xl font-black leading-tight md:text-5xl">{c.beyondTitle}</h2>
              <div className="mt-7 space-y-5 text-lg leading-9 text-[#4d4d4d]">
                {c.beyondParas.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTORS */}
        <section className="mx-auto max-w-7xl px-6 py-24">
          <div className="mb-12 max-w-3xl">
            <p className="text-sm font-black text-[#a67c28]">{c.sectorsKicker}</p>
            <h2 className="mt-4 text-3xl font-black leading-tight md:text-5xl">{c.sectorsTitle}</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {c.sectors.map((sector) => (
              <div key={sector} className="group rounded-3xl border border-[#e3d5bd] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-[#d7b56d] hover:shadow-xl">
                <div className="mb-5 h-2 w-14 rounded-full bg-[#d7b56d]" />
                <h3 className="text-xl font-black">{sector}</h3>
                <p className="mt-4 leading-7 text-[#666]">{c.sectorDesc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="px-6 pb-24">
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
                <a href={registerHref} className="rounded-full bg-[#d7b56d] px-9 py-4 text-sm font-black text-[#171717] transition hover:-translate-y-1 hover:bg-[#e5c77d]">
                  {c.ctaRegister}
                </a>
                <a href={submitHref} className="rounded-full border border-white/25 bg-white/10 px-9 py-4 text-sm font-black text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white/20">
                  {c.ctaSubmit}
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
