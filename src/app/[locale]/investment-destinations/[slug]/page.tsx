import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PublicHeader from "@/components/PublicHeader";
import Footer from "@/components/Footer";
import Faq from "@/components/Faq";
import OpportunityCard, { type OpportunityCardData } from "@/components/OpportunityCard";
import DestinationLeadForm from "./DestinationLeadForm";
import { toVersion } from "@/lib/opportunity";
import { localizeVersion, localizeTerm, SECTOR_I18N, COUNTRY_I18N } from "@/lib/opp-i18n";
import { isLocale, localeHref, type Locale } from "@/lib/i18n";
import { destUi } from "@/lib/dest-i18n";
import {
  getDestinationBySlug,
  getDestinationOpportunities,
  destPath,
  hubPath,
  absUrl,
  strArr,
  faqArr,
  buildLanguageAlternates,
  breadcrumbLd,
  webPageLd,
  faqPageLd,
  organizationLd,
  jsonLdScript,
} from "@/lib/destinations";

export const dynamic = "force-dynamic";

type Params = { locale: string; slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const tr = await getDestinationBySlug(locale, slug);
  if (!tr) return {};

  const url = absUrl(destPath(locale, slug));
  const title = tr.seoTitle || tr.pageTitle || tr.h1Title;
  const description = tr.metaDescription || tr.introText || undefined;
  const keywords = [tr.focusKeyword, ...strArr(tr.secondaryKeywords)]
    .filter(Boolean)
    .join(", ");
  const images = tr.ogImage
    ? [tr.ogImage]
    : tr.destination.featuredImage
      ? [tr.destination.featuredImage]
      : undefined;

  return {
    title,
    description,
    keywords: keywords || undefined,
    alternates: {
      canonical: tr.canonicalUrl || url,
      languages: buildLanguageAlternates(tr.destination.translations),
    },
    robots: { index: tr.robotsIndex, follow: tr.robotsFollow },
    openGraph: {
      title: tr.ogTitle || title,
      description: tr.ogDescription || description,
      url,
      siteName: "Baraka Partners",
      locale,
      type: "website",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: tr.twitterTitle || tr.ogTitle || title,
      description: tr.twitterDescription || tr.ogDescription || description,
      images: tr.twitterImage ? [tr.twitterImage] : images,
    },
  };
}

function fmtRange(min: bigint | null, max: bigint | null, cur: string) {
  if (!min && !max) return null;
  const f = (n: bigint) => Number(n).toLocaleString("en-US");
  return `${min ? f(min) : "?"} – ${max ? f(max) : "?"} ${cur}`;
}

// أيقونات خطّية موحّدة لبطاقات «لماذا الاستثمار» — تدور على نقاط القائمة بدون فرض معنى ثابت
const ICON_PROPS = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  className: "h-6 w-6",
} as const;

const WHY_ICONS = [
  <svg key="globe" {...ICON_PROPS}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18" />
    <path d="M12 3c2.5 2.4 4 5.6 4 9s-1.5 6.6-4 9c-2.5-2.4-4-5.6-4-9s1.5-6.6 4-9z" />
  </svg>,
  <svg key="shield" {...ICON_PROPS}>
    <path d="M12 3l7 2.5v5.5c0 4.2-2.9 7.4-7 9-4.1-1.6-7-4.8-7-9V5.5L12 3z" />
    <path d="M9 12l2 2 4-4" />
  </svg>,
  <svg key="lock" {...ICON_PROPS}>
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </svg>,
  <svg key="chip" {...ICON_PROPS}>
    <rect x="7" y="7" width="10" height="10" rx="1.5" />
    <path d="M10 7V4M14 7V4M10 20v-3M14 20v-3M7 10H4M7 14H4M20 10h-3M20 14h-3" />
  </svg>,
  <svg key="trend" {...ICON_PROPS}>
    <path d="M4 18l5-5 3 3 7-7" />
    <path d="M16 9h4v4" />
  </svg>,
  <svg key="bulb" {...ICON_PROPS}>
    <path d="M9 18h6M10 21h4" />
    <path d="M12 3a6 6 0 0 0-4 10.5c.6.6 1 1.4 1 2.5h6c0-1.1.4-1.9 1-2.5A6 6 0 0 0 12 3z" />
  </svg>,
  <svg key="building" {...ICON_PROPS}>
    <rect x="5" y="3.5" width="14" height="17" rx="1.2" />
    <path d="M9 8h1.5M13.5 8H15M9 12h1.5M13.5 12H15M10 20.5v-3h4v3" />
  </svg>,
  <svg key="users" {...ICON_PROPS}>
    <circle cx="9" cy="8" r="3" />
    <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
    <path d="M16 5.5a3 3 0 0 1 0 5.8" />
    <path d="M19.5 20a5.5 5.5 0 0 0-3.2-5" />
  </svg>,
];

// أيقونات القطاعات (رموز تعبيرية) — تُسنَد بالترتيب، محايدة لغويّاً وتعمل بكل اللغات
const SECTOR_ICONS = ["🏭", "🏢", "🏨", "⚡", "🌾", "🚚", "💻", "📦", "🛢️", "🏗️", "⛏️", "🌍"];

// عنوان قسم موحّد على هوية الموقع (كحلي عريض + شارة ذهبية صغيرة)
function SectionHead({ title }: { title: string }) {
  return (
    <div className="mb-8 flex flex-col items-start">
      <h2 className="text-2xl font-black text-navy sm:text-3xl">{title}</h2>
      <span
        className="mt-3 h-1 w-12 rounded-full bg-gradient-to-r from-gold to-gold-soft"
        aria-hidden="true"
      />
    </div>
  );
}

export default async function DestinationPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;

  const tr = await getDestinationBySlug(locale, slug);
  if (!tr) notFound();

  const ui = destUi(locale);
  const dest = tr.destination;
  const country = tr.countryName || tr.h1Title;

  const whyPoints = strArr(tr.whyInvestPoints);
  const sectors = strArr(tr.keySectorsList);
  const oppTypes = strArr(tr.opportunityTypesList);
  const notes = strArr(tr.investorNotesPoints);
  const faqs = faqArr(tr.faq);
  const opps = await getDestinationOpportunities(dest.id);

  const url = absUrl(destPath(locale, slug));
  const hubUrl = absUrl(hubPath(locale));
  const homeUrl = absUrl(`/${locale}`);

  // ---- Schema.org (JSON-LD) ----
  const ld: unknown[] = [
    webPageLd({ name: tr.h1Title, description: tr.metaDescription || tr.introText, url, locale }),
    breadcrumbLd([
      { name: ui.breadcrumbHome, url: homeUrl },
      { name: ui.hub, url: hubUrl },
      { name: country, url },
    ]),
    organizationLd(),
  ];
  if (faqs.length) ld.push(faqPageLd(faqs));

  return (
    <div className="flex min-h-screen flex-col">
      {ld.map((obj, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(obj) }}
        />
      ))}

      <PublicHeader />

      <main className="flex-1">
        {/* مسار التنقّل */}
        <nav className="mx-auto max-w-6xl px-6 pt-6 text-xs text-gray-500" aria-label="breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li><Link href={localeHref(locale, "/")} className="hover:text-baraka">{ui.breadcrumbHome}</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href={hubPath(locale)} className="hover:text-baraka">{ui.hub}</Link></li>
            <li aria-hidden="true">/</li>
            <li className="font-medium text-gray-700">{country}</li>
          </ol>
        </nav>

        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            className="bg-navy"
            style={
              dest.featuredImage
                ? {
                    backgroundImage: `linear-gradient(to top, rgba(10,31,60,0.94), rgba(10,31,60,0.72)), url(${dest.featuredImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : undefined
            }
          >
            <div className="mx-auto max-w-6xl px-6 py-20 text-white sm:py-28">
              {dest.flagEmoji && <div className="mb-4 text-4xl">{dest.flagEmoji}</div>}
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-gold">{ui.hub}</p>
              <h1 className="max-w-3xl text-4xl font-black leading-[1.1] sm:text-5xl">{tr.h1Title}</h1>
              {tr.introText && (
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#d3dcea] sm:text-lg">{tr.introText}</p>
              )}
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#opportunities"
                  className="rounded-[10px] bg-gradient-to-br from-gold to-gold-soft px-6 py-3 text-sm font-bold text-navy transition hover:brightness-110"
                >
                  {ui.explore}
                </a>
                <a
                  href="#contact"
                  className="rounded-[10px] border border-white/30 bg-white/5 px-6 py-3 text-sm font-bold text-white backdrop-blur-sm transition hover:border-gold hover:text-gold"
                >
                  {ui.contactCta}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* لماذا الاستثمار — بطاقات أيقونات على خلفية فاتحة (شبكة) */}
        {whyPoints.length > 0 && (
          <section className="bg-white py-16 sm:py-20">
            <div className="mx-auto max-w-6xl px-6">
              <SectionHead title={tr.whyInvestTitle || ui.whyInvest} />
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {whyPoints.map((p, i) => (
                  <div
                    key={i}
                    className="group flex items-start gap-4 rounded-2xl border border-[#e6e9ef] bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:border-gold hover:shadow-[0_18px_44px_rgba(10,31,60,.08)]"
                  >
                    <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-baraka-light text-baraka transition group-hover:bg-gold/15 group-hover:text-gold">
                      {WHY_ICONS[i % WHY_ICONS.length]}
                    </span>
                    <p className="pt-1.5 text-[15px] font-bold leading-snug text-navy">{p}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* القطاعات الواعدة — ميداليات دائرية على هوية الموقع */}
        {sectors.length > 0 && (
          <section className="bg-[#f6f7f9] py-16 sm:py-20">
            <div className="mx-auto max-w-6xl px-6">
              <SectionHead title={tr.keySectorsTitle || ui.keySectors} />
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
                {sectors.map((s, i) => (
                  <div key={i} className="group flex flex-col items-center text-center">
                    <div className="relative mb-4 grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-navy to-navy-600 shadow-[0_12px_30px_rgba(10,31,60,.20)] ring-1 ring-gold/20 transition-all duration-200 group-hover:-translate-y-1.5 group-hover:ring-gold/60 sm:h-28 sm:w-28">
                      <span className="absolute inset-0 rounded-full bg-gradient-to-br from-gold/15 to-transparent" aria-hidden="true" />
                      <span className="relative text-4xl leading-none">{SECTOR_ICONS[i % SECTOR_ICONS.length]}</span>
                    </div>
                    <h3 className="text-sm font-bold text-navy sm:text-base">{s}</h3>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* الفرص المرتبطة بالدولة */}
        <section id="opportunities" className="scroll-mt-24 bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-6">
            <SectionHead title={`${ui.oppsTitlePrefix} ${country}`} />
            {opps.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[#d6ddea] bg-[#f6f7f9] px-6 py-12 text-center sm:py-16">
                <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-navy text-gold ring-1 ring-gold/25">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
                    <circle cx="11" cy="11" r="7" />
                    <path d="M21 21l-4.3-4.3" />
                  </svg>
                </div>
                <p className="mx-auto mb-7 max-w-xl text-[15px] leading-relaxed text-[#5c6b80]">{ui.oppsEmpty}</p>
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center rounded-[10px] bg-gradient-to-br from-gold to-gold-soft px-6 py-3 text-sm font-bold text-navy transition hover:-translate-y-px hover:brightness-110"
                >
                  {ui.contactCta}
                </a>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {opps.map((o) => {
                  const pv = localizeVersion(toVersion(o.publicVersion), locale);
                  const localSector = localizeTerm(SECTOR_I18N, o.sector, locale);
                  const data: OpportunityCardData = {
                    id: o.id,
                    href: localeHref(locale, `/opportunities/${o.id}`),
                    title: pv?.displayTitle || `${localSector}`,
                    summary: pv?.summary,
                    sector: localSector,
                    country: localizeTerm(COUNTRY_I18N, o.country, locale),
                    range: fmtRange(o.investmentMin, o.investmentMax, o.currency),
                    imageUrl: pv?.imageUrl ?? null,
                  };
                  return <OpportunityCard key={o.id} data={data} locale={locale} />;
                })}
              </div>
            )}
          </div>
        </section>

        {/* أنواع الفرص المتاحة + معلومات أولية للمستثمر — عمودان متجاوران */}
        {(oppTypes.length > 0 || notes.length > 0) && (
          <section className="bg-[#f6f7f9] py-16 sm:py-20">
            <div className="mx-auto grid max-w-6xl gap-6 px-6 lg:grid-cols-2 lg:items-start">
              {oppTypes.length > 0 && (
                <div className="rounded-3xl border border-[#e6e9ef] bg-white p-7 sm:p-8">
                  <SectionHead title={tr.opportunityTypesTitle || ui.opportunityTypes} />
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {oppTypes.map((p, i) => (
                      <li key={i} className="flex items-center gap-3 text-[15px] leading-relaxed text-[#33415c]">
                        <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-baraka-light text-gold">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                            <path d="M5 12l4 4L19 7" />
                          </svg>
                        </span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {notes.length > 0 && (
                <div className="rounded-3xl border border-gold/25 bg-gradient-to-br from-[#fdfaf2] to-white p-7 sm:p-8">
                  <SectionHead title={tr.investorNotesTitle || ui.investorNotes} />
                  <ul className="grid gap-2.5 sm:grid-cols-2">
                    {notes.map((p, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-[15px] leading-relaxed text-[#33415c]">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}

        {/* الأسئلة الشائعة */}
        {faqs.length > 0 && (
          <section className="bg-white py-16 sm:py-20">
            <div className="mx-auto max-w-3xl px-6">
              <SectionHead title={ui.faqTitle} />
              <Faq items={faqs.map((f) => ({ q: f.q, a: f.a }))} />
            </div>
          </section>
        )}

        {/* نموذج التواصل — قسم داكن بعمودين (عنوان + نموذج) */}
        <section id="contact" className="scroll-mt-24 bg-baraka-dark">
          <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
              <div className="lg:pt-2">
                <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl">
                  {tr.ctaTitle || ui.formTitle}
                </h2>
                {tr.ctaDescription && (
                  <p className="mt-4 max-w-md text-base leading-relaxed text-[#cfd8e6]">{tr.ctaDescription}</p>
                )}
                <div className="mt-6 h-1 w-16 rounded-full bg-gradient-to-r from-gold to-gold-soft" />
              </div>
              <DestinationLeadForm
                locale={locale}
                destinationId={dest.id}
                countryKey={dest.countryKey}
                sectors={sectors}
                tone="dark"
              />
            </div>
          </div>
        </section>

        {/* التنبيه القانوني */}
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="rounded-xl border border-[#e6e9ef] bg-[#f6f7f9] p-5 text-xs leading-relaxed text-[#5c6b80]">
            <strong className="font-semibold text-[#33415c]">{ui.disclaimerTitle}: </strong>
            {tr.disclaimerText || ui.disclaimerDefault}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
