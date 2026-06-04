import Link from "next/link";
import PublicHeader from "@/components/PublicHeader";
import Footer from "@/components/Footer";
import OpportunityCard, { type OpportunityCardData } from "@/components/OpportunityCard";
import { prisma } from "@/lib/prisma";
import { toVersion } from "@/lib/opportunity";
import { getLocale } from "@/lib/i18n-server";
import { t } from "@/lib/i18n";

export const dynamic = "force-dynamic";

const icons = {
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  doc: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z",
  check: "M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3",
  arrow: "M5 12h14M13 6l6 6-6 6",
  spark: "M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8",
  lock: "M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4",
  users: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  eye: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  quote: "M3 21c3-2 5-5 5-9V5H4v6h3M14 21c3-2 5-5 5-9V5h-4v6h3",
};

function Icon({ d, size = 22 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {d.split("M").filter(Boolean).map((seg, i) => <path key={i} d={"M" + seg} />)}
    </svg>
  );
}

function fmtRange(min: bigint | null, max: bigint | null, cur: string) {
  if (!min && !max) return null;
  const f = (n: bigint) => Number(n).toLocaleString("en-US");
  return `${min ? f(min) : "?"} – ${max ? f(max) : "?"} ${cur}`;
}

export default async function Home() {
  const locale = await getLocale();
  const isRtl = locale === "ar";

  // فرص منشورة للعرض المميّز (نسخة عامة فقط)
  const opps = await prisma.opportunity.findMany({
    where: { state: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    take: 3,
    select: { id: true, sector: true, country: true, currency: true, investmentMin: true, investmentMax: true, publicVersion: true },
  });
  const featured: OpportunityCardData[] = opps.map((o) => {
    const pv = toVersion(o.publicVersion);
    return {
      id: o.id,
      href: `/opportunities/${o.id}`,
      title: pv?.displayTitle || `${t(locale, "opp.inSector")} ${o.sector}`,
      summary: pv?.summary,
      sector: o.sector,
      country: o.country,
      range: fmtRange(o.investmentMin, o.investmentMax, o.currency),
      imageUrl: pv?.imageUrl ?? null,
    };
  });

  const trust = [
    { icon: icons.shield, title: "home.trust1Title", desc: "home.trust1Desc" },
    { icon: icons.doc, title: "home.trust2Title", desc: "home.trust2Desc" },
    { icon: icons.check, title: "home.trust3Title", desc: "home.trust3Desc" },
  ];
  const steps = [
    { n: 1, title: "home.step1Title", desc: "home.step1Desc" },
    { n: 2, title: "home.step2Title", desc: "home.step2Desc" },
    { n: 3, title: "home.step3Title", desc: "home.step3Desc" },
  ];
  const chips = ["home.heroChip1", "home.heroChip2", "home.heroChip3"];
  const stats = [
    { num: "home.stat1Num", label: "home.stat1Label" },
    { num: "home.stat2Num", label: "home.stat2Label" },
    { num: "home.stat3Num", label: "home.stat3Label" },
  ];
  const creds = ["home.cred1", "home.cred2", "home.cred3", "home.cred4"];
  const tiers = [
    { icon: icons.eye, title: "home.tier1Title", desc: "home.tier1Desc", w: "w-1/3" },
    { icon: icons.users, title: "home.tier2Title", desc: "home.tier2Desc", w: "w-2/3" },
    { icon: icons.lock, title: "home.tier3Title", desc: "home.tier3Desc", w: "w-full" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF9]">
      <PublicHeader />
      <main className="flex-1">
        {/* ===== Hero ===== */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-baraka-light/70 via-[#F8FAF9] to-[#F8FAF9]" />
          <div className="absolute inset-0 -z-10 bg-grid" />
          <div className="absolute -top-24 start-0 -z-10 h-72 w-72 rounded-full bg-baraka/20 blur-3xl" />
          <div className="absolute top-20 end-0 -z-10 h-72 w-72 rounded-full bg-teal-300/20 blur-3xl" />

          <div className="max-w-6xl mx-auto px-6 pt-16 pb-20 sm:pt-24 grid items-center gap-12 lg:grid-cols-2">
            {/* النص */}
            <div className="flex flex-col items-start gap-6 text-start">
              <span className="rise inline-flex items-center gap-2 rounded-full border border-baraka/20 bg-white/70 px-4 py-1.5 text-xs font-semibold text-baraka-dark shadow-sm backdrop-blur">
                <span className="text-baraka"><Icon d={icons.spark} size={14} /></span>
                {t(locale, "home.heroBadge")}
              </span>
              <h1 className="rise text-4xl sm:text-5xl lg:text-6xl font-extrabold text-baraka-dark leading-[1.12] tracking-tight" style={{ animationDelay: "60ms" }}>
                {t(locale, "home.title")}
              </h1>
              <p className="rise max-w-xl text-lg leading-relaxed text-gray-600" style={{ animationDelay: "120ms" }}>
                {t(locale, "home.tagline")}
              </p>
              <div className="rise flex flex-wrap items-center gap-2.5" style={{ animationDelay: "180ms" }}>
                {chips.map((c) => (
                  <span key={c} className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-gray-600 shadow-sm ring-1 ring-gray-200">
                    <span className="text-baraka"><Icon d={icons.check} size={13} /></span>
                    {t(locale, c)}
                  </span>
                ))}
              </div>
              <div className="rise flex flex-wrap items-center gap-3 pt-1" style={{ animationDelay: "240ms" }}>
                <Link href="/opportunities" className="group inline-flex items-center gap-2 rounded-xl bg-baraka px-7 py-3.5 font-semibold text-white shadow-lg shadow-baraka/25 transition-all duration-200 hover:bg-baraka-dark hover:shadow-xl hover:shadow-baraka/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-baraka">
                  {t(locale, "home.browse")}
                  <span className={isRtl ? "rotate-180" : ""}><Icon d={icons.arrow} size={18} /></span>
                </Link>
                <Link href="/how-it-works" className="inline-flex items-center rounded-xl border border-baraka/30 bg-white px-7 py-3.5 font-semibold text-baraka-dark transition-colors duration-200 hover:bg-baraka-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-baraka">
                  {t(locale, "home.learnMore")}
                </Link>
              </div>
            </div>

            {/* العنصر البصري — بطاقة فرصة زجاجية */}
            <div className="rise relative mx-auto w-full max-w-md lg:mx-0" style={{ animationDelay: "200ms" }}>
              <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-baraka/15 to-teal-400/10 blur-2xl" />
              {/* البطاقة الرئيسية */}
              <div className="float rotate-[-2deg] rounded-3xl border border-white/60 bg-white/80 p-3 shadow-2xl shadow-baraka/10 backdrop-blur">
                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
                  {/* الغلاف */}
                  <div className="relative h-36 bg-gradient-to-br from-emerald-500 to-teal-600">
                    <svg className="absolute bottom-0 start-0 text-white opacity-25" width="180" height="100" viewBox="0 0 160 96" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M14 84h132M28 58l34-16 34 10 34-26M130 28h-14m14 0v14" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col justify-between p-4">
                      <div className="flex items-start justify-between gap-2">
                        <span className="rounded bg-white/25 px-2 py-0.5 text-xs text-white backdrop-blur-sm">{t(locale, "home.heroCardSector")}</span>
                        <span className="whitespace-nowrap rounded bg-white/90 px-2 py-0.5 text-xs font-semibold text-baraka-dark">300K – 600K USD</span>
                      </div>
                      <span className="text-sm font-bold text-white drop-shadow">{t(locale, "home.heroCardCountry")}</span>
                    </div>
                  </div>
                  {/* الجسم */}
                  <div className="p-5">
                    <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-baraka-light px-2.5 py-1 text-[11px] font-semibold text-baraka-dark">
                      <Icon d={icons.lock} size={12} />
                      {t(locale, "home.heroCardBadge")}
                    </div>
                    <h3 className="mb-3 font-bold text-gray-900">{t(locale, "home.heroCardTitle")}</h3>
                    <div className="space-y-2">
                      <div className="h-2.5 w-full rounded-full bg-gray-100" />
                      <div className="h-2.5 w-4/5 rounded-full bg-gray-100" />
                      <div className="h-2.5 w-3/5 rounded-full bg-gray-100" />
                    </div>
                    <div className="mt-4 flex items-center gap-1.5 border-t border-gray-100 pt-3 text-xs text-gray-500">
                      <span className="h-2 w-2 rounded-full bg-baraka" />
                      <span className="h-2 w-2 rounded-full bg-baraka/50" />
                      <span className="h-2 w-2 rounded-full bg-gray-200" />
                      <span className="ms-1.5">{t(locale, "home.heroCardTiers")}</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* شارة عائمة */}
              <div className="float-slow absolute -bottom-5 -start-5 flex items-center gap-2 rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-xl">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-baraka text-white">
                  <Icon d={icons.check} size={16} />
                </span>
                <div className="leading-tight">
                  <p className="text-sm font-bold text-gray-900">{t(locale, "home.heroFloat")}</p>
                  <p className="text-[11px] text-gray-500">NCNDA</p>
                </div>
              </div>
            </div>
          </div>

          {/* شريط الإحصاءات */}
          <div className="max-w-5xl mx-auto px-6 pb-4">
            <div className="grid grid-cols-3 divide-x divide-gray-200 rounded-2xl border border-gray-200 bg-white/80 py-6 shadow-sm backdrop-blur rtl:divide-x-reverse">
              {stats.map((s) => (
                <div key={s.label} className="flex flex-col items-center gap-1 px-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-baraka tabular-nums">{t(locale, s.num)}</span>
                  <span className="text-center text-xs leading-snug text-gray-500 sm:text-sm">{t(locale, s.label)}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Credibility strip ===== */}
        <section className="border-y border-gray-100 bg-white">
          <div className="max-w-6xl mx-auto px-6 py-7">
            <p className="mb-4 text-center text-sm font-medium text-gray-500">{t(locale, "home.credStrip")}</p>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {creds.map((c) => (
                <span key={c} className="inline-flex items-center gap-2 text-sm font-semibold text-baraka-dark">
                  <Icon d={icons.shield} size={16} />
                  {t(locale, c)}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Featured opportunities ===== */}
        <section className="max-w-6xl mx-auto px-6 py-16 sm:py-20">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-sm font-bold uppercase tracking-wider text-baraka">{t(locale, "home.featuredEyebrow")}</span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-baraka-dark">{t(locale, "home.featuredTitle")}</h2>
              <p className="mt-1 text-gray-500">{t(locale, "home.featuredSub")}</p>
            </div>
            <Link href="/opportunities" className="group inline-flex items-center gap-2 rounded-xl border border-baraka/30 bg-white px-5 py-2.5 text-sm font-semibold text-baraka-dark transition-colors hover:bg-baraka-light">
              {t(locale, "home.featuredCta")}
              <span className={isRtl ? "rotate-180" : ""}><Icon d={icons.arrow} size={16} /></span>
            </Link>
          </div>
          {featured.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((d) => <OpportunityCard key={d.id} data={d} locale={locale} />)}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
              <p className="text-gray-500">{t(locale, "home.featuredEmpty")}</p>
            </div>
          )}
        </section>

        {/* ===== Confidentiality tiers ===== */}
        <section className="border-y border-gray-100 bg-white">
          <div className="max-w-6xl mx-auto px-6 py-16 sm:py-20 grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="text-sm font-bold uppercase tracking-wider text-baraka">{t(locale, "home.tiersEyebrow")}</span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-baraka-dark">{t(locale, "home.tiersTitle")}</h2>
              <p className="mt-3 max-w-md leading-relaxed text-gray-500">{t(locale, "home.tiersSub")}</p>
            </div>
            {/* تمثيل بصري للمستويات الثلاثة */}
            <div className="flex flex-col gap-4">
              {tiers.map((tier, i) => (
                <div key={tier.title} className={`${tier.w} ms-auto flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md`}>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-baraka-light text-baraka-dark">
                    <Icon d={tier.icon} size={20} />
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-baraka">{i + 1}</span>
                      <h3 className="truncate font-bold text-gray-900">{t(locale, tier.title)}</h3>
                    </div>
                    <p className="truncate text-sm text-gray-500">{t(locale, tier.desc)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Trust ===== */}
        <section className="max-w-6xl mx-auto px-6 py-16 sm:py-20">
          <div className="mb-10 text-center">
            <span className="text-sm font-bold uppercase tracking-wider text-baraka">{t(locale, "home.trustEyebrow")}</span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-baraka-dark">{t(locale, "home.trustTitle")}</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {trust.map((c) => (
              <div key={c.title} className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-baraka/30 hover:shadow-lg">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-baraka-light text-baraka-dark transition-colors duration-200 group-hover:bg-baraka group-hover:text-white">
                  <Icon d={c.icon} />
                </div>
                <h3 className="mb-1.5 text-lg font-bold text-gray-900">{t(locale, c.title)}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{t(locale, c.desc)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== How it works ===== */}
        <section className="border-y border-gray-100 bg-white">
          <div className="max-w-6xl mx-auto px-6 py-16 sm:py-20">
            <div className="mb-12 text-center">
              <span className="text-sm font-bold uppercase tracking-wider text-baraka">{t(locale, "home.howEyebrow")}</span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-baraka-dark">{t(locale, "home.howTitle")}</h2>
              <p className="mt-2 text-gray-500">{t(locale, "home.howSub")}</p>
            </div>
            <div className="relative grid gap-6 md:grid-cols-3">
              <div className="pointer-events-none absolute inset-x-0 top-12 hidden h-px bg-gradient-to-r from-transparent via-baraka/25 to-transparent md:block" />
              {steps.map((s) => (
                <div key={s.n} className="relative rounded-2xl border border-gray-200 bg-white p-7 text-center shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-baraka text-lg font-extrabold text-white shadow-md shadow-baraka/30 ring-4 ring-white">
                    {s.n}
                  </div>
                  <h3 className="mb-2 text-base font-bold text-gray-900">{t(locale, s.title)}</h3>
                  <p className="text-sm leading-relaxed text-gray-500">{t(locale, s.desc)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Quote ===== */}
        <section className="max-w-4xl mx-auto px-6 py-16 sm:py-20 text-center">
          <span className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-baraka-light text-baraka">
            <Icon d={icons.quote} size={24} />
          </span>
          <blockquote className="text-xl sm:text-2xl font-bold leading-relaxed text-baraka-dark">
            {t(locale, "home.quote")}
          </blockquote>
          <div className="mt-6">
            <p className="font-bold text-gray-900">{t(locale, "home.quoteAuthor")}</p>
            <p className="text-sm text-gray-500">{t(locale, "home.quoteRole")}</p>
          </div>
        </section>

        {/* ===== Audience split ===== */}
        <section className="border-t border-gray-100 bg-white">
          <div className="max-w-6xl mx-auto px-6 py-16 sm:py-20">
            <div className="mb-10 text-center">
              <span className="text-sm font-bold uppercase tracking-wider text-baraka">{t(locale, "home.audienceEyebrow")}</span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-baraka-dark">{t(locale, "home.audienceTitle")}</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-200 hover:border-baraka/30 hover:shadow-lg">
                <div className="absolute -end-8 -top-8 h-28 w-28 rounded-full bg-baraka-light/70 blur-2xl" />
                <div className="relative flex flex-col">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-baraka-light text-baraka-dark"><Icon d={icons.users} /></div>
                  <h3 className="mb-2 text-xl font-bold text-baraka-dark">{t(locale, "home.forInvestorsTitle")}</h3>
                  <p className="mb-6 flex-1 text-sm leading-relaxed text-gray-600">{t(locale, "home.forInvestorsDesc")}</p>
                  <Link href="/register" className="inline-flex w-fit items-center gap-2 rounded-lg bg-baraka px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-baraka-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-baraka">
                    {t(locale, "reg.asInvestor")}
                    <span className={isRtl ? "rotate-180" : ""}><Icon d={icons.arrow} size={16} /></span>
                  </Link>
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-200 hover:border-baraka/30 hover:shadow-lg">
                <div className="absolute -end-8 -top-8 h-28 w-28 rounded-full bg-baraka-light/70 blur-2xl" />
                <div className="relative flex flex-col">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-baraka-light text-baraka-dark"><Icon d={icons.lock} /></div>
                  <h3 className="mb-2 text-xl font-bold text-baraka-dark">{t(locale, "home.forOwnersTitle")}</h3>
                  <p className="mb-6 flex-1 text-sm leading-relaxed text-gray-600">{t(locale, "home.forOwnersDesc")}</p>
                  <Link href="/register/owner" className="inline-flex w-fit items-center gap-2 rounded-lg border border-baraka/30 px-5 py-2.5 text-sm font-semibold text-baraka-dark transition-colors duration-200 hover:bg-baraka-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-baraka">
                    {t(locale, "home.ownerRegister")}
                    <span className={isRtl ? "rotate-180" : ""}><Icon d={icons.arrow} size={16} /></span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== Final CTA ===== */}
        <section className="max-w-6xl mx-auto px-6 py-16 sm:py-20">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-baraka to-baraka-dark px-8 py-14 text-center text-white shadow-xl">
            <div className="absolute -end-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -start-10 -bottom-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <div className="relative">
              <h2 className="mb-3 text-2xl sm:text-3xl font-extrabold">{t(locale, "home.ctaTitle")}</h2>
              <p className="mx-auto mb-7 max-w-xl text-baraka-light">{t(locale, "home.ctaSub")}</p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/register" className="inline-flex items-center rounded-xl bg-white px-7 py-3.5 font-semibold text-baraka-dark shadow-lg transition-transform duration-200 hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                  {t(locale, "reg.asInvestor")}
                </Link>
                <Link href="/register/owner" className="inline-flex items-center rounded-xl border border-white/50 px-7 py-3.5 font-semibold text-white transition-colors duration-200 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                  {t(locale, "home.ownerRegister")}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
