import type { Metadata } from "next";
import PublicHeader from "@/components/PublicHeader";
import Footer from "@/components/Footer";
import AgentApplicationWizard from "@/components/AgentApplicationWizard";
import { getLocale } from "@/lib/i18n-server";
import { isLocale, DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import { agentUi } from "@/lib/agent-i18n";
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

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-navy to-navy-600 text-white">
          <div className="mx-auto max-w-4xl px-6 py-16 text-center sm:py-20">
            <span className="mb-4 inline-block rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-bold tracking-wide text-gold-soft">
              {ui.heroEyebrow}
            </span>
            <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl">{ui.h1}</h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-[#cdd6e4]">{ui.intro}</p>
            <a
              href="#apply"
              className="mt-8 inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-gold to-gold-soft px-7 py-3 text-sm font-bold text-navy transition hover:brightness-110"
            >
              {ui.ctaStart}
            </a>
          </div>
        </section>

        <div className="mx-auto max-w-4xl px-6 py-14">
          {/* من هو الوكيل */}
          <section className="mb-14">
            <h2 className="mb-3 text-2xl font-extrabold text-baraka-dark">{ui.whoTitle}</h2>
            <p className="mb-3 leading-relaxed text-gray-700">{ui.whoBody}</p>
            <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-800">{ui.whoNote}</p>
          </section>

          {/* أنواع الأصول */}
          <section className="mb-14">
            <h2 className="mb-2 text-2xl font-extrabold text-baraka-dark">{ui.assetTypesTitle}</h2>
            <p className="mb-6 text-sm text-gray-500">{ui.assetTypesSub}</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {ASSET_TYPES.map((tx) => (
                <div key={tx.code} className="flex items-center gap-2.5 rounded-xl border border-gray-200 bg-white p-3.5 text-sm">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-baraka-light text-baraka-dark">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                  </span>
                  <span className="font-medium text-navy">{pick(tx.label, locale)}</span>
                </div>
              ))}
            </div>
          </section>

          {/* طريقة العمل */}
          <section className="mb-14">
            <h2 className="mb-6 text-2xl font-extrabold text-baraka-dark">{ui.howTitle}</h2>
            <ol className="flex flex-col gap-3">
              {ui.howSteps.map((stepText, i) => (
                <li key={i} className="flex items-start gap-3.5 rounded-xl border border-gray-200 bg-white p-4">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-navy text-sm font-bold text-white">{i + 1}</span>
                  <span className="pt-0.5 text-sm leading-relaxed text-gray-700">{stepText}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* ملاحظات قانونية */}
          <section className="mb-14 rounded-2xl border border-gray-200 bg-gray-50 p-6">
            <h2 className="mb-4 text-lg font-extrabold text-baraka-dark">{ui.legalTitle}</h2>
            <ul className="flex flex-col gap-2.5">
              {ui.legalPoints.map((p, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed text-gray-600">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  {p}
                </li>
              ))}
            </ul>
          </section>

          {/* النموذج */}
          <section id="apply" className="scroll-mt-24">
            <div className="mb-6 text-center">
              <span className="mb-2 inline-block text-xs font-bold tracking-wide text-gold">{ui.applyEyebrow}</span>
              <h2 className="text-2xl font-extrabold text-baraka-dark">{ui.applyTitle}</h2>
              <p className="mt-1 text-sm text-gray-500">{ui.applySub}</p>
            </div>
            <AgentApplicationWizard locale={locale} />
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
