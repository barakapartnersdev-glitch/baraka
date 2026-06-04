import Link from "next/link";
import PublicHeader from "@/components/PublicHeader";
import Footer from "@/components/Footer";
import { getLocale } from "@/lib/i18n-server";
import { t } from "@/lib/i18n";

const icons = {
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  doc: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z",
  check: "M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3",
};

function Icon({ d }: { d: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {d.split("M").filter(Boolean).map((seg, i) => <path key={i} d={"M" + seg} />)}
    </svg>
  );
}

export default async function Home() {
  const locale = await getLocale();

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

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-baraka-light/60 to-transparent">
          <div className="max-w-5xl mx-auto px-6 py-20 text-center flex flex-col items-center gap-6">
            <span className="inline-flex items-center gap-2 text-xs font-medium text-baraka-dark bg-baraka-light px-3 py-1 rounded-full">
              {t(locale, "home.heroBadge")}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-baraka-dark leading-tight">
              {t(locale, "home.title")}
            </h1>
            <p className="text-gray-600 max-w-2xl leading-relaxed text-lg">
              {t(locale, "home.tagline")}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/opportunities" className="bg-baraka text-white px-6 py-3 rounded-lg hover:bg-baraka-dark transition">
                {t(locale, "home.browse")}
              </Link>
              <Link href="/register" className="border border-baraka text-baraka-dark px-6 py-3 rounded-lg hover:bg-baraka-light transition">
                {t(locale, "reg.asInvestor")}
              </Link>
            </div>
          </div>
        </section>

        {/* Trust strip */}
        <section className="max-w-5xl mx-auto px-6 -mt-8">
          <div className="grid md:grid-cols-3 gap-4">
            {trust.map((c) => (
              <div key={c.title} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-baraka-light flex items-center justify-center text-baraka-dark mb-3">
                  <Icon d={c.icon} />
                </div>
                <h3 className="font-bold mb-1">{t(locale, c.title)}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{t(locale, c.desc)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="max-w-5xl mx-auto px-6 py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-baraka-dark mb-2">
              {t(locale, "home.howTitle")}
            </h2>
            <p className="text-gray-500">{t(locale, "home.howSub")}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((s) => (
              <div key={s.n} className="relative bg-white border border-gray-200 rounded-2xl p-6">
                <div className="w-9 h-9 rounded-full bg-baraka text-white flex items-center justify-center font-bold mb-3">
                  {s.n}
                </div>
                <h3 className="font-bold mb-1.5">{t(locale, s.title)}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{t(locale, s.desc)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Audience split */}
        <section className="bg-baraka-light/40">
          <div className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-8 flex flex-col">
              <h3 className="text-xl font-bold text-baraka-dark mb-2">{t(locale, "home.forInvestorsTitle")}</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-6 flex-1">{t(locale, "home.forInvestorsDesc")}</p>
              <Link href="/register" className="bg-baraka text-white px-5 py-2.5 rounded-lg text-sm hover:bg-baraka-dark transition w-fit">
                {t(locale, "reg.asInvestor")}
              </Link>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-8 flex flex-col">
              <h3 className="text-xl font-bold text-baraka-dark mb-2">{t(locale, "home.forOwnersTitle")}</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-6 flex-1">{t(locale, "home.forOwnersDesc")}</p>
              <Link href="/register/owner" className="border border-baraka text-baraka-dark px-5 py-2.5 rounded-lg text-sm hover:bg-baraka-light transition w-fit">
                {t(locale, "home.ownerRegister")}
              </Link>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="max-w-5xl mx-auto px-6 py-16">
          <div className="bg-baraka rounded-2xl px-8 py-12 text-center text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">{t(locale, "home.ctaTitle")}</h2>
            <p className="text-baraka-light mb-6">{t(locale, "home.ctaSub")}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/register" className="bg-white text-baraka-dark px-6 py-3 rounded-lg hover:bg-baraka-light transition">
                {t(locale, "reg.asInvestor")}
              </Link>
              <Link href="/register/owner" className="border border-white/60 text-white px-6 py-3 rounded-lg hover:bg-white/10 transition">
                {t(locale, "home.ownerRegister")}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
