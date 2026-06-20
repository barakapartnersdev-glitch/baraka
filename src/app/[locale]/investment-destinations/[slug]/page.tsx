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
  <svg key="trend" {...ICON_PROPS}>
    <path d="M4 18l5-5 3 3 7-7" />
    <path d="M16 9h4v4" />
  </svg>,
  <svg key="truck" {...ICON_PROPS}>
    <path d="M3 7h11v8H3zM14 10h4l3 3v2h-7z" />
    <circle cx="7" cy="17.5" r="1.5" />
    <circle cx="17.5" cy="17.5" r="1.5" />
  </svg>,
  <svg key="building" {...ICON_PROPS}>
    <rect x="5" y="3.5" width="14" height="17" rx="1.2" />
    <path d="M9 8h1.5M13.5 8H15M9 12h1.5M13.5 12H15M10 20.5v-3h4v3" />
  </svg>,
  <svg key="gift" {...ICON_PROPS}>
    <rect x="4" y="9" width="16" height="11" rx="1.5" />
    <path d="M4 13h16M12 9v11M12 9C9 9 8 4 12 4c4 0 3 5 0 5z" />
  </svg>,
  <svg key="users" {...ICON_PROPS}>
    <circle cx="9" cy="8" r="3" />
    <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
    <path d="M16 5.5a3 3 0 0 1 0 5.8" />
    <path d="M19.5 20a5.5 5.5 0 0 0-3.2-5" />
  </svg>,
  <svg key="shield" {...ICON_PROPS}>
    <path d="M12 3l7 2.5v5.5c0 4.2-2.9 7.4-7 9-4.1-1.6-7-4.8-7-9V5.5L12 3z" />
    <path d="M9 12l2 2 4-4" />
  </svg>,
  <svg key="bulb" {...ICON_PROPS}>
    <path d="M9 18h6M10 21h4" />
    <path d="M12 3a6 6 0 0 0-4 10.5c.6.6 1 1.4 1 2.5h6c0-1.1.4-1.9 1-2.5A6 6 0 0 0 12 3z" />
  </svg>,
];

// صورة افتراضية للواجهة (تُستخدَم إن لم تُضبَط صورة الدولة في قاعدة البيانات)
const HERO_DEFAULT =
  "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1600&q=70";

// صور دائرية للقطاعات — تُسنَد بالترتيب (محايدة لغويّاً). الترتيب يلائم تركيا افتراضياً.
const SECTOR_PHOTOS = [
  "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=400&h=400&q=70", // صناعة
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&h=400&q=70", // عقارات
  "https://images.unsplash.com/photo-1570939274717-7eda259b50ed?auto=format&fit=crop&w=400&h=400&q=70", // سياحة
  "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=400&h=400&q=70", // طاقة
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=400&h=400&q=70", // زراعة
  "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&h=400&q=70", // لوجستيات
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&h=400&q=70", // تقنية
  "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=400&h=400&q=70", // تصدير/موانئ
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&h=400&q=70", // غذاء
  "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=400&h=400&q=70", // حاويات
  "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=400&h=400&q=70", // إسطنبول
  "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=400&h=400&q=70", // بنية تحتية
];

// عنوان قسم موحّد على هوية الموقع (كحلي عريض + شارة ذهبية صغيرة)
function SectionHead({ title }: { title: string }) {
  return (
    <div className="mb-6 flex flex-col items-start">
      <h2 className="text-2xl font-black text-navy sm:text-[28px]">{title}</h2>
      <span
        className="mt-3 h-1 w-12 rounded-full bg-gradient-to-r from-gold to-gold-soft"
        aria-hidden="true"
      />
    </div>
  );
}

// ميدالية دائرية بصورة فوتوغرافية للقطاع
function SectorMedallion({ label, src, size = "lg" }: { label?: string; src: string; size?: "lg" | "sm" }) {
  const dim = size === "lg" ? "h-24 w-24 sm:h-28 sm:w-28" : "h-20 w-20";
  return (
    <figure className="group m-0 flex flex-col items-center text-center">
      <div className={`relative ${dim} overflow-hidden rounded-full shadow-[0_12px_28px_rgba(10,31,60,.20)] ring-4 ring-white transition-all duration-200 group-hover:-translate-y-1.5`}>
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
          style={{ backgroundImage: `url(${src})` }}
        />
        <div className="absolute inset-0 rounded-full bg-gradient-to-t from-navy/45 to-transparent" />
        <div className="absolute inset-0 rounded-full ring-2 ring-inset ring-gold/50" />
      </div>
      {label && <figcaption className="mt-3 text-sm font-bold text-navy sm:text-[15px]">{label}</figcaption>}
    </figure>
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

  const heroImage = dest.featuredImage || HERO_DEFAULT;
  const btnGold =
    "inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-gold to-gold-soft px-6 py-3 text-sm font-bold text-navy transition hover:-translate-y-px hover:brightness-110";
  const btnGhost =
    "inline-flex items-center justify-center rounded-xl border border-white/40 bg-white/5 px-6 py-3 text-sm font-bold text-white backdrop-blur-sm transition hover:border-gold hover:text-gold";
  const card =
    "rounded-3xl border border-[#e9edf3] bg-white p-6 shadow-[0_10px_40px_rgba(10,31,60,.05)] sm:p-8";

  return (
    <div className="flex min-h-screen flex-col bg-[#eef1f6] text-[#1a2433]">
      {ld.map((obj, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(obj) }}
        />
      ))}

      <PublicHeader />

      <main className="flex-1">
        {/* ===== Hero — صورة ممتدّة + تعتيم كحلي ===== */}
        <section className="relative isolate overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImage})` }}
            aria-hidden="true"
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(10,31,60,.96), rgba(10,31,60,.74) 58%, rgba(10,31,60,.55))" }}
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-6xl px-5 pb-28 pt-12 text-white sm:px-6 sm:pb-36 sm:pt-16">
            {/* مسار التنقّل */}
            <nav className="mb-7 text-xs text-[#cdd6e4]" aria-label="breadcrumb">
              <ol className="flex flex-wrap items-center gap-1.5">
                <li><Link href={localeHref(locale, "/")} className="transition hover:text-gold">{ui.breadcrumbHome}</Link></li>
                <li aria-hidden="true" className="text-white/40">/</li>
                <li><Link href={hubPath(locale)} className="transition hover:text-gold">{ui.hub}</Link></li>
                <li aria-hidden="true" className="text-white/40">/</li>
                <li className="font-medium text-white">{country}</li>
              </ol>
            </nav>

            <div className="mb-5 flex flex-wrap items-center gap-3">
              {dest.flagEmoji && <span className="text-4xl leading-none">{dest.flagEmoji}</span>}
              {dest.region && (
                <span className="rounded-full border border-gold/40 bg-gold/15 px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.12em] text-gold-soft backdrop-blur">
                  {dest.region}
                </span>
              )}
            </div>
            <h1 className="max-w-3xl text-4xl font-black leading-[1.1] drop-shadow-[0_2px_20px_rgba(0,0,0,0.4)] sm:text-5xl">{tr.h1Title}</h1>
            {tr.introText && (
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#dbe3ef] sm:text-lg">{tr.introText}</p>
            )}
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#opportunities" className={btnGold}>{ui.explore}</a>
              <a href="#contact" className={btnGhost}>{ui.contactCta}</a>
            </div>
          </div>
        </section>

        {/* ===== البطاقات — تتداخل مع الواجهة ===== */}
        <div className="mx-auto -mt-16 max-w-6xl space-y-6 px-4 pb-16 sm:px-6">
          {/* لماذا الاستثمار — بطاقات أيقونات */}
          {whyPoints.length > 0 && (
            <section className={card}>
              <SectionHead title={tr.whyInvestTitle || ui.whyInvest} />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {whyPoints.map((p, i) => (
                  <div
                    key={i}
                    className="group rounded-2xl border border-[#e9edf3] bg-[#f8fafc] p-5 transition-all duration-200 hover:-translate-y-1 hover:border-gold hover:bg-white hover:shadow-[0_12px_30px_rgba(10,31,60,.08)]"
                  >
                    <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-baraka-light text-baraka transition group-hover:bg-gold/15 group-hover:text-gold">
                      {WHY_ICONS[i % WHY_ICONS.length]}
                    </span>
                    <p className="text-[15px] font-bold leading-snug text-navy">{p}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* القطاعات الواعدة — دوائر صور فوتوغرافية */}
          {sectors.length > 0 && (
            <section className={card}>
              <SectionHead title={tr.keySectorsTitle || ui.keySectors} />
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
                {sectors.map((s, i) => (
                  <SectorMedallion key={i} label={s} src={SECTOR_PHOTOS[i % SECTOR_PHOTOS.length]} />
                ))}
              </div>
            </section>
          )}

          {/* الفرص المرتبطة بالدولة */}
          <section id="opportunities" className={`scroll-mt-24 ${card}`}>
            <SectionHead title={`${ui.oppsTitlePrefix} ${country}`} />
            {opps.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#d6ddea] bg-[#f8fafc] px-6 py-10 text-center">
                <div className="mb-6 flex flex-wrap justify-center gap-6">
                  {[6, 7, 9].map((idx, k) => (
                    <SectorMedallion key={k} src={SECTOR_PHOTOS[idx % SECTOR_PHOTOS.length]} size="sm" />
                  ))}
                </div>
                <p className="mx-auto mb-7 max-w-xl text-[15px] leading-relaxed text-[#5c6b80]">{ui.oppsEmpty}</p>
                <a href="#contact" className={btnGold}>{ui.contactCta}</a>
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
          </section>

          {/* أنواع الفرص + معلومات أولية للمستثمر — عمودان */}
          {(oppTypes.length > 0 || notes.length > 0) && (
            <div className="grid gap-6 lg:grid-cols-2">
              {oppTypes.length > 0 && (
                <section className={card}>
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
                </section>
              )}

              {notes.length > 0 && (
                <section className={`${card} border-gold/25 bg-gradient-to-br from-[#fdfaf2] to-white`}>
                  <SectionHead title={tr.investorNotesTitle || ui.investorNotes} />
                  <ul className="grid gap-2.5 sm:grid-cols-2">
                    {notes.map((p, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-[15px] leading-relaxed text-[#33415c]">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          )}

          {/* الأسئلة الشائعة */}
          {faqs.length > 0 && (
            <section className={card}>
              <SectionHead title={ui.faqTitle} />
              <Faq items={faqs.map((f) => ({ q: f.q, a: f.a }))} />
            </section>
          )}

          {/* نموذج التواصل — بطاقة كحلية بعمودين */}
          <section id="contact" className="scroll-mt-24 overflow-hidden rounded-3xl bg-baraka-dark text-white shadow-[0_10px_40px_rgba(10,31,60,.12)]">
            <div className="grid gap-10 p-6 sm:p-10 lg:grid-cols-2 lg:items-start">
              <div className="lg:pt-2">
                <h2 className="text-2xl font-bold leading-tight text-white sm:text-3xl">
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
          </section>

          {/* التنبيه القانوني */}
          <div className="px-2 pt-2 text-xs leading-relaxed text-[#5c6b80]">
            <strong className="font-semibold text-[#33415c]">{ui.disclaimerTitle}: </strong>
            {tr.disclaimerText || ui.disclaimerDefault}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
