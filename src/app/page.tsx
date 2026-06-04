import Link from "next/link";
import PublicHeader from "@/components/PublicHeader";
import Footer from "@/components/Footer";
import { getLocale } from "@/lib/i18n-server";
import { t } from "@/lib/i18n";

const icons = {
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  doc: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z",
  check: "M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3",
  arrow: "M5 12h14M13 6l6 6-6 6",
  spark: "M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8",
  lock: "M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4",
  users: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
};

function Icon({ d, size = 22 }: { d: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {d.split("M").filter(Boolean).map((seg, i) => (
        <path key={i} d={"M" + seg} />
      ))}
    </svg>
  );
}

export default async function Home() {
  const locale = await getLocale();
  const isRtl = locale === "ar";

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

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF9]">
      <PublicHeader />
      <main className="flex-1">
        {/* ===== Hero ===== */}
        <section className="relative overflow-hidden">
          {/* خلفية متدرّجة + توهّج + شبكة */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-baraka-light/70 via-[#F8FAF9] to-[#F8FAF9]" />
          <div className="absolute inset-0 -z-10 bg-grid" />
          <div className="absolute -top-32 start-1/2 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-baraka/20 blur-3xl" />

          <div className="max-w-5xl mx-auto px-6 pt-20 pb-16 sm:pt-28 text-center flex flex-col items-center gap-6">
            <span className="rise inline-flex items-center gap-2 rounded-full border border-baraka/20 bg-white/70 px-4 py-1.5 text-xs font-semibold text-baraka-dark shadow-sm backdrop-blur">
              <span className="text-baraka"><Icon d={icons.spark} size={14} /></span>
              {t(locale, "home.heroBadge")}
            </span>

            <h1 className="rise text-4xl sm:text-5xl md:text-6xl font-extrabold text-baraka-dark leading-[1.15] tracking-tight" style={{ animationDelay: "60ms" }}>
              {t(locale, "home.title")}
            </h1>

            <p className="rise max-w-2xl text-lg leading-relaxed text-gray-600" style={{ animationDelay: "120ms" }}>
              {t(locale, "home.tagline")}
            </p>

            {/* شرائح الثقة */}
            <div className="rise flex flex-wrap items-center justify-center gap-2.5" style={{ animationDelay: "180ms" }}>
              {chips.map((c) => (
                <span key={c} className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-gray-600 shadow-sm ring-1 ring-gray-200">
                  <span className="text-baraka"><Icon d={icons.check} size={13} /></span>
                  {t(locale, c)}
                </span>
              ))}
            </div>

            {/* أزرار الإجراء */}
            <div className="rise flex flex-wrap items-center justify-center gap-3 pt-2" style={{ animationDelay: "240ms" }}>
              <Link
                href="/opportunities"
                className="group inline-flex items-center gap-2 rounded-xl bg-baraka px-7 py-3.5 font-semibold text-white shadow-lg shadow-baraka/25 transition-all duration-200 hover:bg-baraka-dark hover:shadow-xl hover:shadow-baraka/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-baraka"
              >
                {t(locale, "home.browse")}
                <span className={isRtl ? "rotate-180" : ""}><Icon d={icons.arrow} size={18} /></span>
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center rounded-xl border border-baraka/30 bg-white px-7 py-3.5 font-semibold text-baraka-dark transition-colors duration-200 hover:bg-baraka-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-baraka"
              >
                {t(locale, "reg.asInvestor")}
              </Link>
            </div>

            {/* شريط الإحصاءات */}
            <div className="rise mt-10 grid w-full max-w-3xl grid-cols-3 divide-x divide-gray-200 rounded-2xl border border-gray-200 bg-white/80 py-6 shadow-sm backdrop-blur rtl:divide-x-reverse" style={{ animationDelay: "300ms" }}>
              {stats.map((s) => (
                <div key={s.label} className="flex flex-col items-center gap-1 px-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-baraka tabular-nums">{t(locale, s.num)}</span>
                  <span className="text-xs sm:text-sm text-gray-500 text-center leading-snug">{t(locale, s.label)}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Trust ===== */}
        <section className="max-w-5xl mx-auto px-6 py-16 sm:py-20">
          <div className="mb-10 text-center">
            <span className="text-sm font-bold uppercase tracking-wider text-baraka">{t(locale, "home.trustEyebrow")}</span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-baraka-dark">{t(locale, "home.trustTitle")}</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {trust.map((c) => (
              <div
                key={c.title}
                className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-baraka/30 hover:shadow-lg"
              >
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
          <div className="max-w-5xl mx-auto px-6 py-16 sm:py-20">
            <div className="mb-12 text-center">
              <span className="text-sm font-bold uppercase tracking-wider text-baraka">{t(locale, "home.howEyebrow")}</span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-baraka-dark">{t(locale, "home.howTitle")}</h2>
              <p className="mt-2 text-gray-500">{t(locale, "home.howSub")}</p>
            </div>
            <div className="relative grid gap-6 md:grid-cols-3">
              {/* خط الربط بين الخطوات */}
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

        {/* ===== Audience split ===== */}
        <section className="max-w-5xl mx-auto px-6 py-16 sm:py-20">
          <div className="mb-10 text-center">
            <span className="text-sm font-bold uppercase tracking-wider text-baraka">{t(locale, "home.audienceEyebrow")}</span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-baraka-dark">{t(locale, "home.audienceTitle")}</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {/* المستثمرون */}
            <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-200 hover:border-baraka/30 hover:shadow-lg">
              <div className="absolute -end-8 -top-8 h-28 w-28 rounded-full bg-baraka-light/70 blur-2xl transition-opacity duration-300 group-hover:opacity-80" />
              <div className="relative flex flex-col">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-baraka-light text-baraka-dark">
                  <Icon d={icons.users} />
                </div>
                <h3 className="mb-2 text-xl font-bold text-baraka-dark">{t(locale, "home.forInvestorsTitle")}</h3>
                <p className="mb-6 flex-1 text-sm leading-relaxed text-gray-600">{t(locale, "home.forInvestorsDesc")}</p>
                <Link
                  href="/register"
                  className="inline-flex w-fit items-center gap-2 rounded-lg bg-baraka px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-baraka-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-baraka"
                >
                  {t(locale, "reg.asInvestor")}
                  <span className={isRtl ? "rotate-180" : ""}><Icon d={icons.arrow} size={16} /></span>
                </Link>
              </div>
            </div>
            {/* أصحاب المشاريع */}
            <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-200 hover:border-baraka/30 hover:shadow-lg">
              <div className="absolute -end-8 -top-8 h-28 w-28 rounded-full bg-baraka-light/70 blur-2xl transition-opacity duration-300 group-hover:opacity-80" />
              <div className="relative flex flex-col">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-baraka-light text-baraka-dark">
                  <Icon d={icons.lock} />
                </div>
                <h3 className="mb-2 text-xl font-bold text-baraka-dark">{t(locale, "home.forOwnersTitle")}</h3>
                <p className="mb-6 flex-1 text-sm leading-relaxed text-gray-600">{t(locale, "home.forOwnersDesc")}</p>
                <Link
                  href="/register/owner"
                  className="inline-flex w-fit items-center gap-2 rounded-lg border border-baraka/30 px-5 py-2.5 text-sm font-semibold text-baraka-dark transition-colors duration-200 hover:bg-baraka-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-baraka"
                >
                  {t(locale, "home.ownerRegister")}
                  <span className={isRtl ? "rotate-180" : ""}><Icon d={icons.arrow} size={16} /></span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ===== Final CTA ===== */}
        <section className="max-w-5xl mx-auto px-6 pb-20">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-baraka to-baraka-dark px-8 py-14 text-center text-white shadow-xl">
            <div className="absolute -end-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -start-10 -bottom-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <div className="relative">
              <h2 className="mb-3 text-2xl sm:text-3xl font-extrabold">{t(locale, "home.ctaTitle")}</h2>
              <p className="mx-auto mb-7 max-w-xl text-baraka-light">{t(locale, "home.ctaSub")}</p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  href="/register"
                  className="inline-flex items-center rounded-xl bg-white px-7 py-3.5 font-semibold text-baraka-dark shadow-lg transition-transform duration-200 hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  {t(locale, "reg.asInvestor")}
                </Link>
                <Link
                  href="/register/owner"
                  className="inline-flex items-center rounded-xl border border-white/50 px-7 py-3.5 font-semibold text-white transition-colors duration-200 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
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
