// الصفحة العامة «وكلاء أصحاب الأصول» — تصميم فاخر، 3 لغات فعلية (zh→en)، SEO، والنموذج الحقيقي.
/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import PublicHeader from "@/components/PublicHeader";
import Footer from "@/components/Footer";
import AgentApplicationWizard from "@/components/AgentApplicationWizard";
import { getLocale } from "@/lib/i18n-server";
import { isLocale, DEFAULT_LOCALE, dir, type Locale } from "@/lib/i18n";
import { agentUi } from "@/lib/agent-i18n";
import { agentX } from "@/lib/agent-extra";
import { ASSET_TYPES, pick } from "@/lib/agent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : DEFAULT_LOCALE;
  const ui = agentUi(loc);
  return {
    title: ui.metaTitle,
    description: ui.metaDescription,
    openGraph: {
      title: ui.metaTitle,
      description: ui.metaDescription,
      siteName: "Baraka Partners",
      locale: loc,
      type: "website",
    },
  };
}

export default async function AssetOwnerAgentsPage() {
  const locale = await getLocale();
  const ui = agentUi(locale);
  const ax = agentX(locale);
  const d = dir(locale);
  // التدرّج الداكن يبدأ من جهة النص (يمين في RTL، يسار في LTR) ليبقى مقروءاً.
  const heroGrad = d === "rtl" ? "bg-gradient-to-l" : "bg-gradient-to-r";

  const assetLabel = (code: string) => {
    const t = ASSET_TYPES.find((a) => a.code === code);
    return t ? pick(t.label, locale) : code;
  };

  // ست بطاقات مصوّرة لأبرز أنواع الأصول (صور خاصة بهذه الصفحة فقط).
  const showcase = [
    { code: "residential", img: "/asset-agents/residential.jpg" },
    { code: "commercial", img: "/asset-agents/commercial.jpg" },
    { code: "factories", img: "/asset-agents/factory.jpg" },
    { code: "hotels", img: "/asset-agents/hotel.jpg" },
    { code: "agricultural", img: "/asset-agents/agri.jpg" },
    { code: "distressed", img: "/asset-agents/distressed.jpg" },
  ];

  const stats: [string, string][] = [
    [ax.stat1t, ax.stat1s],
    [ax.stat2t, ax.stat2s],
    [ax.stat3t, ax.stat3s],
    [ax.stat4t, ax.stat4s],
  ];
  const whoChips = [ax.whoChip1, ax.whoChip2, ax.whoChip3, ax.whoChip4];
  const agentDuties = [ui.capProvideInfo, ui.capContactOwner, ui.capArrangeMeeting, ui.capProvideDocs, ui.capOwnerWants, ui.capOwnerPermission];
  const platformProvides = [ax.platformProvide1, ax.platformProvide2, ax.platformProvide3, ax.platformProvide4, ax.platformProvide5, ax.platformProvide6];

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main dir={d} className="bg-[#f7f1e7] text-[#171717]">
        {/* HERO */}
        <section className="relative min-h-[92vh] overflow-hidden">
          <div className="absolute inset-0">
            <img src="/asset-agents/hero.jpg" alt={ui.heroEyebrow} className="h-full w-full object-cover object-center" />
            <div className={`absolute inset-0 ${heroGrad} from-black/92 via-black/70 to-black/30`} />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(215,181,109,0.36),transparent_28%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.10),transparent_30%)]" />
          </div>
          <div className="relative mx-auto flex min-h-[92vh] max-w-7xl items-center px-6 py-24">
            <div className="max-w-4xl">
              <div className="mb-6 inline-flex rounded-full border border-[#d7b56d]/50 bg-white/10 px-5 py-2 text-sm font-black text-[#e8cf91] backdrop-blur">
                {ui.heroEyebrow}
              </div>
              <h1 className="text-4xl font-black leading-tight text-white md:text-6xl lg:text-7xl">
                {ui.h1}
                <span className="mt-4 block text-[#d7b56d]">{ax.heroGold}</span>
              </h1>
              <p className="mt-7 max-w-3xl text-lg leading-9 text-white/80 md:text-xl">{ui.intro}</p>
              <div className="mt-10 flex flex-wrap gap-4">
                <a href="#apply" className="rounded-full bg-[#d7b56d] px-8 py-4 text-sm font-black text-[#171717] shadow-xl transition hover:-translate-y-1 hover:bg-[#e5c77d]">
                  {ui.ctaStart}
                </a>
                <a href="#how" className="rounded-full border border-white/25 bg-white/10 px-8 py-4 text-sm font-black text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white/20">
                  {ui.howTitle}
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

        {/* WHO IS AN AGENT */}
        <section className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-24 lg:grid-cols-2">
          <div>
            <p className="text-sm font-black text-[#a67c28]">{ui.whoTitle}</p>
            <h2 className="mt-4 text-3xl font-black leading-tight md:text-5xl">
              {ax.whoH2a}
              <span className="block text-[#a67c28]">{ax.whoH2b}</span>
            </h2>
            <div className="mt-7 space-y-5 text-lg leading-9 text-[#4d4d4d]">
              <p>{ui.whoBody}</p>
              <p>{ui.whoNote}</p>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {whoChips.map((item) => (
                <div key={item} className="rounded-3xl border border-[#e3d5bd] bg-white p-5 font-bold shadow-sm">
                  <span className="text-[#a67c28]">✓</span> {item}
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -right-8 -top-8 h-60 w-60 rounded-full bg-[#d7b56d]/25 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2.8rem] shadow-2xl">
              <img src="/asset-agents/intro.jpg" alt="" loading="lazy" className="h-[560px] w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
              <div className="absolute bottom-8 right-8 left-8 rounded-3xl border border-white/15 bg-white/10 p-6 text-white backdrop-blur-xl">
                <h3 className="text-2xl font-black text-[#d7b56d]">{ax.whoCardTitle}</h3>
                <p className="mt-3 leading-8 text-white/80">{ax.whoCardText}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ASSET SHOWCASE */}
        <section className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12 max-w-3xl">
              <p className="text-sm font-black text-[#a67c28]">{ui.assetTypesTitle}</p>
              <h2 className="mt-4 text-3xl font-black leading-tight md:text-5xl">{ui.assetTypesSub}</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {showcase.map((s) => (
                <article key={s.code} className="group relative h-72 overflow-hidden rounded-[2.5rem] border border-[#e3d5bd] bg-black shadow-sm transition hover:-translate-y-2 hover:shadow-2xl">
                  <img src={s.img} alt={assetLabel(s.code)} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  <div className="absolute bottom-7 right-7 left-7">
                    <div className="mb-4 h-1.5 w-14 rounded-full bg-[#d7b56d]" />
                    <h3 className="text-2xl font-black text-white">{assetLabel(s.code)}</h3>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ACCEPTED LIST (full) */}
        <section className="mx-auto max-w-7xl px-6 py-24">
          <div className="mb-12 max-w-3xl">
            <p className="text-sm font-black text-[#a67c28]">{ax.acceptKicker}</p>
            <h2 className="mt-4 text-3xl font-black leading-tight md:text-5xl">{ax.acceptH2}</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ASSET_TYPES.filter((a) => a.code !== "other").map((a) => (
              <div key={a.code} className="rounded-3xl border border-[#e3d5bd] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#d7b56d] hover:shadow-xl">
                <div className="mb-4 h-2 w-14 rounded-full bg-[#d7b56d]" />
                <h3 className="text-xl font-black">{pick(a.label, locale)}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* RESPONSIBILITIES & PLATFORM */}
        <section className="relative overflow-hidden bg-[#171717] py-24 text-white">
          <div className="absolute inset-0 opacity-20">
            <img src="/asset-agents/respbg.jpg" alt="" loading="lazy" className="h-full w-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-[#171717]/88" />
          <div className="relative mx-auto max-w-7xl px-6">
            <div className="mb-12 max-w-3xl">
              <p className="text-sm font-black text-[#d7b56d]">{ax.respKicker}</p>
              <h2 className="mt-4 text-3xl font-black leading-tight md:text-5xl">{ax.respH2}</h2>
            </div>
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="rounded-[2.5rem] border border-white/10 bg-white/10 p-8 backdrop-blur-xl">
                <h3 className="text-3xl font-black text-[#d7b56d]">{ax.respAgentTitle}</h3>
                <div className="mt-8 grid gap-4">
                  {agentDuties.map((item) => (
                    <div key={item} className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                      <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#d7b56d] text-xs font-black text-[#171717]">✓</span>
                      <span className="leading-7 text-white/80">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-[2.5rem] border border-white/10 bg-white/10 p-8 backdrop-blur-xl">
                <h3 className="text-3xl font-black text-[#d7b56d]">{ax.respPlatformTitle}</h3>
                <div className="mt-8 grid gap-4">
                  {platformProvides.map((item) => (
                    <div key={item} className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                      <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#d7b56d] text-xs font-black text-[#171717]">✓</span>
                      <span className="leading-7 text-white/80">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STEPS */}
        <section id="how" className="mx-auto max-w-7xl scroll-mt-24 px-6 py-24">
          <div className="mb-14 text-center">
            <p className="text-sm font-black text-[#a67c28]">{ui.howTitle}</p>
            <h2 className="mx-auto mt-4 max-w-4xl text-3xl font-black leading-tight md:text-5xl">{ax.stepsH2}</h2>
            <p className="mx-auto mt-5 max-w-3xl text-lg leading-9 text-[#555]">{ax.stepsLead}</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ui.howSteps.map((step, i) => (
              <div key={i} className="flex gap-5 rounded-[2rem] border border-[#e3d5bd] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <div className="text-4xl font-black leading-none text-[#d7b56d]">{String(i + 1).padStart(2, "0")}</div>
                <p className="leading-8 text-[#444]">{step}</p>
              </div>
            ))}
          </div>
        </section>

        {/* LEGAL */}
        <section className="mx-auto max-w-7xl px-6 pb-24">
          <div className="rounded-[2.5rem] border border-[#d7b56d] bg-[#fff8e8] p-8 md:p-12">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <p className="text-sm font-black text-[#a67c28]">{ui.legalTitle}</p>
                <h2 className="mt-3 text-3xl font-black leading-tight md:text-4xl">{ax.legalH2}</h2>
                <p className="mt-5 leading-8 text-[#555]">{ax.legalLead}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {ui.legalPoints.map((note, i) => (
                  <div key={i} className="rounded-2xl border border-[#ead7a5] bg-white p-5 leading-8 text-[#4d4d4d]">
                    <span className="font-black text-[#a67c28]">•</span> {note}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* APPLICATION FORM */}
        <section id="apply" className="scroll-mt-24 bg-white py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12 max-w-3xl">
              <p className="text-sm font-black text-[#a67c28]">{ui.applyEyebrow}</p>
              <h2 className="mt-4 text-3xl font-black leading-tight md:text-5xl">{ui.applyTitle}</h2>
              <p className="mt-5 text-lg leading-9 text-[#555]">{ui.applySub}</p>
            </div>
            <AgentApplicationWizard locale={locale} />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
